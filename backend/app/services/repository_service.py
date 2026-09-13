from app.schemas.repository import AnalyzeRepositoryResponse
from app.services.git_service import GitService, RepositoryCloneError
from app.services.scanner_service import RepositoryScanner
from app.utils.github_url import InvalidGitHubUrlError, parse_github_url


class RepositoryService:
    def __init__(self):
        self.git_service = GitService()
        self.scanner = RepositoryScanner()

    def analyze(self, url: str) -> AnalyzeRepositoryResponse:
        parsed_url = parse_github_url(url)
        clone_dir = None

        try:
            clone_dir = self.git_service.clone(parsed_url)
            scan_result = self.scanner.scan(clone_dir)

            return AnalyzeRepositoryResponse(
                repository_name=parsed_url.repository_name,
                owner=parsed_url.owner,
                total_source_files=scan_result["total_source_files"],
                total_folders=scan_result["total_folders"],
                programming_languages=scan_result["programming_languages"],
                source_file_paths=scan_result["source_file_paths"],
            )
        finally:
            if clone_dir is not None:
                self.git_service.cleanup(clone_dir)


__all__ = [
    "RepositoryService",
    "InvalidGitHubUrlError",
    "RepositoryCloneError",
]