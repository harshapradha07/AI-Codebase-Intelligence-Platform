from fastapi import APIRouter, HTTPException

from app.schemas.repository import AnalyzeRepositoryRequest, AnalyzeRepositoryResponse
from app.services.git_service import RepositoryCloneError
from app.services.repository_service import RepositoryService
from app.utils.github_url import InvalidGitHubUrlError

router = APIRouter(prefix="/api/repositories", tags=["repositories"])
repository_service = RepositoryService()


@router.post("/analyze", response_model=AnalyzeRepositoryResponse)
def analyze_repository(request: AnalyzeRepositoryRequest) -> AnalyzeRepositoryResponse:
    """Clone and scan a public GitHub repository."""
    try:
        return repository_service.analyze(request.url)
    except InvalidGitHubUrlError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RepositoryCloneError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while analyzing the repository.",
        ) from exc
