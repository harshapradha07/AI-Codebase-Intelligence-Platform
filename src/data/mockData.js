export const pipelineSteps = [
  {
    step: 1,
    title: 'Repository Upload',
    description: 'Accepts custom GitHub URLs, checks branch privileges, structure, and verifies connectivity.'
  },
  {
    step: 2,
    title: 'Repository Cloning',
    description: 'Clones source code, compiles file hierarchy, maps API paths, and reads dependencies config.'
  },
  {
    step: 3,
    title: 'Code Chunking',
    description: 'Splits large code files into semantic chunks while maintaining function boundaries and overlaps.'
  },
  {
    step: 4,
    title: 'Embedding Generation',
    description: 'Transforms text chunks into multi-dimensional floating vectors utilizing AI embedding algorithms.'
  },
  {
    step: 5,
    title: 'Vector Database Storage',
    description: 'Saves high-dimensional vectors inside ChromaDB to enable sub-millisecond semantic retrieval query lookups.'
  },
  {
    step: 6,
    title: 'Vector Search & QA',
    description: 'Executes vector cosine similarity matching inside ChromaDB database indexes to retrieve key chunks.'
  },
  {
    step: 7,
    title: 'Response Generation',
    description: 'Large Language Model routes retrieved contexts to format answers with summaries and citations.'
  },
  {
    step: 8,
    title: 'Architecture Mapping',
    description: 'Constructs interactive system architecture flow schemas illustrating files and modules dependency.'
  },
  {
    step: 9,
    title: 'Advanced Diagnostics',
    description: 'Detects code smells, maps file risk hotspots, scans security vulnerability leaks, and formats reviews.'
  }
];

export const repositoryStats = [
  { label: 'Indexed Files', value: '2,438', icon: 'files' },
  { label: 'Avg. Query Latency', value: '84ms', icon: 'bolt' },
  { label: 'Security Signals', value: '7', icon: 'shield' },
  { label: 'Code Review Score', value: '92%', icon: 'spark' }
];

export const repositoryOverview = {
  repository: 'facebook/react',
  status: 'ready',
  stats: repositoryStats,
  message: 'Enter a GitHub repository URL to begin analysis.'
};

export const homeHeroContent = {
  title: 'AI Codebase Intelligence & Mapping',
  description: 'Follow the journey of your repository from raw source code to deep, context-aware semantic insights and automated code diagnostics.'
};

export const repositoryPresets = ['facebook/react', 'django/django', 'tensorflow/tensorflow'];

export const architectureNodes = [
  { id: 'upload', label: 'Upload API', sublabel: 'Git Scanner', x: 60, y: 175 },
  { id: 'cloner', label: 'Cloner', sublabel: 'Metadata Extractor', x: 220, y: 175 },
  { id: 'db', label: 'Vector DB', sublabel: 'ChromaDB', x: 370, y: 175 },
  { id: 'llm', label: 'AI Orchestrator', sublabel: 'LLM Agent', x: 500, y: 105 },
  { id: 'ui', label: 'Dashboard UI', sublabel: 'Interface', x: 500, y: 245 }
];

export const dependencyNodes = [
  { id: 'auth', label: 'Auth Service', type: 'service' },
  { id: 'chunker', label: 'Chunker', type: 'engine' },
  { id: 'embedder', label: 'Embedder', type: 'engine' },
  { id: 'db', label: 'ChromaDB', type: 'database' }
];

export const securityFindings = [
  {
    title: 'Hardcoded private client secret',
    severity: 'High',
    description: 'A private client secret appears in configuration storage.',
    code: 'src/config/database.ts:14'
  },
  {
    title: 'Unsafe regex evaluation path',
    severity: 'Medium',
    description: 'Parsing logic may trigger ReDoS on malformed inputs.',
    code: 'src/api/code/chunker.ts:42'
  }
];

export const reviewItems = [
  {
    file: 'src/api/code/chunker.ts',
    title: 'Extract helper to reduce cyclomatic complexity',
    impact: 'High',
    description: 'The chunking pipeline contains nested branching logic that would benefit from decomposition.',
    diff: ['if (currentLength >= this.chunkSize) {', 'chunks.push(this.compileChunk(currentChunk, filePath));', 'currentChunk = this.getOverlapLines(currentChunk);']
  },
  {
    file: 'src/api/ai/agent.ts',
    title: 'Add retries around vector search responses',
    impact: 'Medium',
    description: 'Transient query failures could be mitigated with bounded retry logic.',
    diff: ['const response = await client.search();', 'if (!response.ok) {', 'return fallbackContext;']
  }
];

export const assistantMessages = [
  { sender: 'You', text: 'Summarize the repository structure and main risks.', type: 'user' },
  { sender: 'Aether AI', text: 'The repository exposes three core services: cloning, chunking, and semantic retrieval. Two security concerns are currently flagged.', type: 'assistant' }
];

export const searchResults = [
  { path: 'src/api/code/chunker.ts', score: '0.9482', preview: 'class ChunkProcessor { constructor(chunkSize = 500, overlap = 50) {' },
  { path: 'tests/chunker.test.ts', score: '0.8241', preview: 'describe(\'Chunker Tests\', () => { it(\'should split file correctly\'' },
  { path: 'src/api/code/embedder.ts', score: '0.6845', preview: 'export async function getEmbeddings(textChunks) {' }
];
