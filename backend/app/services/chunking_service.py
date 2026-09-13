from pathlib import Path
from app.services.chunking_service import CodeChunkingService

class CodeChunkingService:
    SUPPORTED_EXTENSIONS = {
        ".py", ".js", ".jsx", ".ts", ".tsx",
        ".java", ".c", ".cpp", ".h", ".hpp",
        ".cs", ".go", ".rs", ".php"
    }

    IGNORE_DIRS = {
        ".git", "node_modules", "dist", "build",
        "venv", ".venv", "__pycache__"
    }

    def __init__(self, chunk_size=100, overlap=20):
        self.chunk_size = chunk_size
        self.overlap = overlap
        clone_dir = self.git_service.clone(parsed_url)
        scan_result = self.scanner.scan(clone_dir)
        chunks = self.chunking_service.chunk_repository(clone_dir)
        print(f"Generated {len(chunks)} code chunks")

    def chunk_repository(self, repository_path):
        repository_path = Path(repository_path)
        chunks = []

        for file_path in repository_path.rglob("*"):
            if not file_path.is_file():
                continue

            if any(part in self.IGNORE_DIRS for part in file_path.parts):
                continue

            if file_path.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
                continue

            try:
                content = file_path.read_text(
                    encoding="utf-8",
                    errors="ignore"
                )
            except Exception:
                continue

            lines = content.splitlines()

            if not lines:
                continue

            start = 0

            while start < len(lines):
                end = min(start + self.chunk_size, len(lines))

                chunk_content = "\n".join(lines[start:end]).strip()

                if chunk_content:
                    chunks.append({
                        "file_path": str(
                            file_path.relative_to(repository_path)
                        ),
                        "start_line": start + 1,
                        "end_line": end,
                        "content": chunk_content
                    })

                if end >= len(lines):
                    break

                start += self.chunk_size - self.overlap

        return chunks