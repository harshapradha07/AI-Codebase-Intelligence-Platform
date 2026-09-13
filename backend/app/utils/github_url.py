import re
from dataclasses import dataclass


GITHUB_URL_PATTERN = re.compile(
    r"^(?:https?://)?(?:www\.)?github\.com/(?P<owner>[\w.-]+)/(?P<repo>[\w.-]+?)(?:\.git)?/?$",
    re.IGNORECASE,
)

GITHUB_SLUG_PATTERN = re.compile(
    r"^(?P<owner>[\w.-]+)/(?P<repo>[\w.-]+)$"
)


@dataclass(frozen=True)
class ParsedGitHubUrl:
    owner: str
    repository_name: str
    clone_url: str

    @property
    def slug(self) -> str:
        return f"{self.owner}/{self.repository_name}"


class InvalidGitHubUrlError(ValueError):
    """Raised when the provided URL is not a valid public GitHub repository URL."""


def parse_github_url(url: str) -> ParsedGitHubUrl:
    """Parse a GitHub repository URL or owner/repo slug into clone metadata."""
    trimmed = (url or "").strip()
    if not trimmed:
        raise InvalidGitHubUrlError("Repository URL is required.")

    normalized = trimmed.replace("git@", "").replace(":", "/", 1) if trimmed.startswith("git@") else trimmed
    normalized = re.sub(r"^https?://", "", normalized, flags=re.IGNORECASE)
    normalized = normalized.rstrip("/")

    match = GITHUB_URL_PATTERN.match(normalized) or GITHUB_SLUG_PATTERN.match(normalized)
    if not match:
        raise InvalidGitHubUrlError(
            "Invalid GitHub repository URL. Expected formats like "
            "'https://github.com/owner/repo' or 'owner/repo'."
        )

    owner = match.group("owner")
    repo = match.group("repo").removesuffix(".git")

    if not owner or not repo:
        raise InvalidGitHubUrlError("Repository owner and name are required.")

    return ParsedGitHubUrl(
        owner=owner,
        repository_name=repo,
        clone_url=f"https://github.com/{owner}/{repo}.git",
    )
