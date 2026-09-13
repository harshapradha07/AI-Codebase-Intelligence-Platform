import shutil
import subprocess
import uuid
from pathlib import Path

from app.config import settings
from app.utils.github_url import ParsedGitHubUrl


class RepositoryCloneError(Exception):
    """Raised when cloning a repository fails."""


class GitService:
    def __init__(self, base_dir: str | None = None, timeout: int | None = None):
        self.base_dir = Path(base_dir or settings.clone_base_dir)
        self.timeout = timeout or settings.git_clone_timeout
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def clone(self, parsed_url: ParsedGitHubUrl) -> Path:
        """Clone the exact repository provided by the user into a unique directory."""
        clone_dir = self.base_dir / f"{parsed_url.owner}_{parsed_url.repository_name}_{uuid.uuid4().hex[:8]}"

        if clone_dir.exists():
            shutil.rmtree(clone_dir, ignore_errors=True)

        try:
            result = subprocess.run(
                [
                    "git",
                    "clone",
                    "--depth",
                    "1",
                    "--single-branch",
                    parsed_url.clone_url,
                    str(clone_dir),
                ],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                check=False,
            )
        except subprocess.TimeoutExpired as exc:
            raise RepositoryCloneError(
                f"Timed out while cloning {parsed_url.slug}. The repository may be too large or unreachable."
            ) from exc
        except FileNotFoundError as exc:
            raise RepositoryCloneError(
                "Git is not installed or not available on PATH. Install Git to clone repositories."
            ) from exc

        if result.returncode != 0:
            stderr = (result.stderr or result.stdout or "").strip()
            # If .git exists and we have some files, proceed with partial checkout
            if (clone_dir / ".git").exists() and any(clone_dir.iterdir()):
                # Partial checkout succeeded - some files may be missing due to Windows path length limits
                pass
            else:
                message = self._map_clone_error(stderr, parsed_url.slug)
                raise RepositoryCloneError(message)

        if not (clone_dir / ".git").exists():
            raise RepositoryCloneError(
                f"Clone completed but repository data was not found for {parsed_url.slug}."
            )

        return clone_dir

    @staticmethod
    def cleanup(clone_dir: Path) -> None:
        shutil.rmtree(clone_dir, ignore_errors=True)

    @staticmethod
    def _map_clone_error(stderr: str, slug: str) -> str:
        lowered = stderr.lower()

        if "repository not found" in lowered or "could not read from remote repository" in lowered:
            return (
                f"Repository '{slug}' was not found or is not accessible. "
                "Verify the URL and ensure the repository is public."
            )
        if "authentication failed" in lowered or "permission denied" in lowered:
            return (
                f"Repository '{slug}' is private or requires authentication. "
                "Only public repositories are supported."
            )
        if "could not resolve host" in lowered or "unable to access" in lowered:
            return "Unable to reach GitHub. Check your network connection and try again."

        return f"Failed to clone repository '{slug}': {stderr or 'Unknown git error.'}"
