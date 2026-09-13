import {
  architectureNodes,
  assistantMessages,
  dependencyNodes,
  repositoryOverview,
  reviewItems,
  searchResults,
  securityFindings
} from '../data/mockData';
const API_BASE_URL = 'http://127.0.0.1:8002';
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeRepositoryInput = (repo) => {
  const trimmed = (repo || '').trim();
  if (!trimmed) {
    return { owner: 'aether', repoName: 'synapse-core', repositorySlug: 'aether/synapse-core' };
  }

  const withoutProtocol = trimmed.replace(/^https?:\/\//i, '').replace(/^git@/i, '');
  const withoutGitSuffix = withoutProtocol.replace(/\.git$/i, '');
  const withoutGithubPrefix = withoutGitSuffix.replace(/^github\.com\//i, '');
  const [owner = 'aether', repoName = 'synapse-core'] = withoutGithubPrefix.split('/').filter(Boolean);

  return {
    owner,
    repoName,
    repositorySlug: `${owner}/${repoName}`
  };
};

const buildFallbackAnalysis = (repo) => {
  const { owner, repoName, repositorySlug } = normalizeRepositoryInput(repo);
  const seed = `${owner}/${repoName}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const fileCount = 180 + (seed % 120);
  const latency = 70 + (seed % 25);
  const score = 86 + (seed % 8);

  return {
    repository: repositorySlug,
    repositoryLabel: repositorySlug,
    owner,
    name: repoName,
    description: 'Repository analysis prepared from the current URL input. Results are simulated in this prototype.',
    files: `${fileCount}+`,
    languages: ['TypeScript', 'JavaScript', 'Python'],
    stats: [
      { label: 'Indexed Files', value: `${fileCount}+`, icon: 'files' },
      { label: 'Avg. Query Latency', value: `${latency}ms`, icon: 'bolt' },
      { label: 'Security Signals', value: `${2 + (seed % 3)}`, icon: 'shield' },
      { label: 'Code Review Score', value: `${score}%`, icon: 'spark' }
    ],
    activity: [
      { label: 'Last commit', value: `${Math.max(1, (seed % 5) + 1)}d ago` },
      { label: 'Open issues', value: `${Math.max(2, (seed % 4) + 2)}` }
    ],
    architectureNodes,
    dependencyNodes,
    securityFindings,
    reviewItems,
    chatMessages: assistantMessages,
    searchResults,
    message: `Repository analysis prepared for ${repositorySlug}. Results are simulated because this prototype does not have a live backend.`,
    status: 'simulated',
    source: 'simulated'
  };
};

export const api = {
  async getRepositoryOverview() {
    await delay();
    return repositoryOverview;
  },

  async analyzeRepository(repo) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/repositories/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: repo
          }),
          signal: AbortSignal.timeout(15000)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 'Repository analysis failed'
        );
      }

      const data = await response.json();
      const repositorySlug =
        `${data.owner}/${data.repository_name}`;

      return {
        // REAL BACKEND DATA
        repository: repositorySlug,
        repositoryLabel: repositorySlug,
        owner: data.owner,
        name: data.repository_name,

        description:
          `Real repository analysis completed for ${repositorySlug}.`,

        files: `${data.total_source_files}`,
        folders: data.total_folders,

        languages:
          data.programming_languages || [],

        sourceFilePaths:
          data.source_file_paths || [],

        stats: [
          {
            label: 'Indexed Files',
            value: `${data.total_source_files}`,
            icon: 'files'
          },
          {
            label: 'Total Folders',
            value: `${data.total_folders}`,
            icon: 'bolt'
          },
          {
            label: 'Languages',
            value: `${data.programming_languages?.length || 0}`,
            icon: 'shield'
          },
          {
            label: 'Analysis Status',
            value: '100%',
            icon: 'spark'
          }
        ],

        // KEEP REQUIRED UI DATA
        activity: [
          {
            label: 'Repository',
            value: repositorySlug
          },
          {
            label: 'Source files',
            value: `${data.total_source_files}`
          },
          {
            label: 'Folders',
            value: `${data.total_folders}`
          }
        ],

        // KEEP EXISTING VISUAL MODULES WORKING
        architectureNodes: architectureNodes || [],
        dependencyNodes: dependencyNodes || [],
        securityFindings: securityFindings || [],
        reviewItems: reviewItems || [],
        chatMessages: assistantMessages || [],
        searchResults: searchResults || [],

        message:
          `Successfully cloned, scanned and analyzed ${repositorySlug}.`,

        status: 'analyzed',
        source: 'fastapi-backend'
      };
    } catch (error) {
      // Graceful fallback: if backend is unreachable, return simulated data
      console.warn('Backend unreachable, using simulated data:', error.message);
      return buildFallbackAnalysis(repo);
    }
  },

  async getArchitecture() {
    await delay();
    return { nodes: architectureNodes, edges: [] };
  },

  async getSecurityFindings() {
    await delay();
    return { findings: securityFindings };
  },

  async getDependencyGraph() {
    await delay();
    return { nodes: dependencyNodes, edges: [] };
  },

  async getCodeReview() {
    await delay();
    return { reviews: reviewItems };
  },

  async getSearchResults() {
    await delay();
    return { results: searchResults };
  },

  async getChatHistory() {
    await delay();
    return { messages: assistantMessages };
  }
};
