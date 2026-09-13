from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Synapse AI Backend"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://0.0.0.0:3001",
    ]
    git_clone_timeout: int = 120
    clone_base_dir: str = "../_cloned_repos"

    class Config:
        env_file = ".env"


settings = Settings()
