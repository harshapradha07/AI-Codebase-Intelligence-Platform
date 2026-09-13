from pathlib import Path

IGNORED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "venv",
    ".venv",
    "__pycache__",
}

SOURCE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".go",
    ".rs",
    ".rb",
    ".php",
    ".c",
    ".cpp",
    ".cc",
    ".cxx",
    ".h",
    ".hpp",
    ".hh",
    ".cs",
    ".swift",
    ".kt",
    ".kts",
    ".scala",
    ".r",
    ".lua",
    ".sh",
    ".bash",
    ".zsh",
    ".ps1",
    ".sql",
    ".vue",
    ".svelte",
    ".dart",
    ".ex",
    ".exs",
    ".erl",
    ".hs",
    ".ml",
    ".mli",
    ".clj",
    ".cljs",
    ".fs",
    ".fsx",
    ".vb",
    ".m",
    ".mm",
    ".groovy",
    ".tf",
    ".proto",
    ".graphql",
    ".gql",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".xml",
    ".md",
    ".rst",
    ".cmake",
    ".gradle",
    ".zig",
    ".nim",
    ".jl",
    ".pl",
    ".pm",
    ".rkt",
    ".elm",
    ".cr",
    ".v",
    ".sv",
    ".vhd",
    ".asm",
    ".s",
}

EXTENSION_TO_LANGUAGE = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".java": "Java",
    ".go": "Go",
    ".rs": "Rust",
    ".rb": "Ruby",
    ".php": "PHP",
    ".c": "C",
    ".cpp": "C++",
    ".cc": "C++",
    ".cxx": "C++",
    ".h": "C/C++ Header",
    ".hpp": "C++",
    ".hh": "C++",
    ".cs": "C#",
    ".swift": "Swift",
    ".kt": "Kotlin",
    ".kts": "Kotlin",
    ".scala": "Scala",
    ".r": "R",
    ".lua": "Lua",
    ".sh": "Shell",
    ".bash": "Shell",
    ".zsh": "Shell",
    ".ps1": "PowerShell",
    ".sql": "SQL",
    ".vue": "Vue",
    ".svelte": "Svelte",
    ".dart": "Dart",
    ".ex": "Elixir",
    ".exs": "Elixir",
    ".erl": "Erlang",
    ".hs": "Haskell",
    ".ml": "OCaml",
    ".mli": "OCaml",
    ".clj": "Clojure",
    ".cljs": "ClojureScript",
    ".fs": "F#",
    ".fsx": "F#",
    ".vb": "Visual Basic",
    ".m": "Objective-C",
    ".mm": "Objective-C++",
    ".groovy": "Groovy",
    ".tf": "Terraform",
    ".proto": "Protocol Buffers",
    ".graphql": "GraphQL",
    ".gql": "GraphQL",
    ".html": "HTML",
    ".htm": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".sass": "Sass",
    ".less": "Less",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".toml": "TOML",
    ".xml": "XML",
    ".md": "Markdown",
    ".rst": "reStructuredText",
    ".cmake": "CMake",
    ".gradle": "Gradle",
    ".zig": "Zig",
    ".nim": "Nim",
    ".jl": "Julia",
    ".pl": "Perl",
    ".pm": "Perl",
    ".rkt": "Racket",
    ".elm": "Elm",
    ".cr": "Crystal",
    ".v": "Verilog",
    ".sv": "SystemVerilog",
    ".vhd": "VHDL",
    ".asm": "Assembly",
    ".s": "Assembly",
}


class RepositoryScanner:
    def scan(self, repo_path: Path) -> dict:
        source_file_paths: list[str] = []
        languages: set[str] = set()
        total_folders = 0

        for current_dir, dirnames, filenames in self._walk(repo_path):
            total_folders += 1

            for filename in filenames:
                file_path = current_dir / filename
                relative_path = file_path.relative_to(repo_path).as_posix()
                suffix = file_path.suffix.lower()

                if suffix in SOURCE_EXTENSIONS:
                    source_file_paths.append(relative_path)
                    language = EXTENSION_TO_LANGUAGE.get(suffix)
                    if language:
                        languages.add(language)

        source_file_paths.sort()

        return {
            "total_source_files": len(source_file_paths),
            "total_folders": total_folders,
            "programming_languages": sorted(languages),
            "source_file_paths": source_file_paths,
        }

    def _walk(self, root: Path):
        """Walk the repository tree while skipping ignored directories."""
        pending = [root]

        while pending:
            current = pending.pop()
            dirnames: list[str] = []
            filenames: list[str] = []

            try:
                for entry in sorted(current.iterdir(), key=lambda item: item.name.lower()):
                    if entry.is_dir():
                        if entry.name not in IGNORED_DIRS:
                            dirnames.append(entry.name)
                            pending.append(entry)
                    elif entry.is_file():
                        filenames.append(entry.name)
            except OSError:
                continue

            yield current, dirnames, filenames
