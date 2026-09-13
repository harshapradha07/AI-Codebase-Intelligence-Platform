from pydantic import BaseModel, Field


class AnalyzeRepositoryRequest(BaseModel):
    url: str = Field(
        ...,
        description="Public GitHub repository URL or owner/repo slug",
        examples=["https://github.com/facebook/react", "facebook/react"],
    )


class AnalyzeRepositoryResponse(BaseModel):
    repository_name: str
    owner: str
    total_source_files: int
    total_folders: int
    programming_languages: list[str]
    source_file_paths: list[str]
