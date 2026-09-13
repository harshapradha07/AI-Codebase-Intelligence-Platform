import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RepositoryAnalysis from './pages/RepositoryAnalysis';
import Assistant from './pages/Assistant';
import Architecture from './pages/Architecture';
import Dependencies from './pages/Dependencies';
import Security from './pages/Security';
import CodeReview from './pages/CodeReview';
import { api } from './services/api';
import { architectureNodes, assistantMessages, dependencyNodes, homeHeroContent, pipelineSteps, repositoryOverview, repositoryPresets, reviewItems, searchResults, securityFindings } from './data/mockData';

const createInitialAnalysisState = () => ({
  repository: repositoryOverview.repository,
  repositoryLabel: repositoryOverview.repository,
  owner: 'aether',
  name: 'synapse-core',
  description: 'Repository visualization powered by mock data.',
  files: '2,438',
  languages: ['TypeScript', 'JavaScript', 'Python'],
  stats: repositoryOverview.stats,
  activity: [
    { label: 'Last commit', value: '2d ago' },
    { label: 'Active branches', value: '3' }
  ],
  architectureNodes,
  dependencyNodes,
  securityFindings,
  reviewItems,
  chatMessages: assistantMessages,
  searchResults,
  message: repositoryOverview.message,
  isLoading: false,
  status: 'ready',
  source: 'mock'
});

function App() {
  const [analysisState, setAnalysisState] = useState(createInitialAnalysisState());

  const handleAnalyze = async (repo) => {
  const normalizedRepo =
    repo && repo.trim()
      ? repo.trim()
      : analysisState.repository;

  // Start loading but DO NOT delete existing module data
  setAnalysisState((previous) => ({
    ...previous,
    repository: normalizedRepo,
    repositoryLabel: normalizedRepo,
    message: 'Cloning and analyzing repository...',
    isLoading: true,
    status: 'loading'
  }));

  try {
    const response = await api.analyzeRepository(normalizedRepo);

    setAnalysisState((previous) => ({
      ...previous,

      // Real repository data
      repository:
        response.repository || normalizedRepo,

      repositoryLabel:
        response.repositoryLabel ||
        response.repository ||
        normalizedRepo,

      owner:
        response.owner || previous.owner,

      name:
        response.name || previous.name,

      description:
        response.description || previous.description,

      files:
        response.files || previous.files,

      languages:
        response.languages?.length
          ? response.languages
          : previous.languages,

      stats:
        response.stats?.length
          ? response.stats
          : previous.stats,

      activity:
        response.activity?.length
          ? response.activity
          : previous.activity,

      // Keep visual modules alive
      architectureNodes:
        response.architectureNodes?.length
          ? response.architectureNodes
          : previous.architectureNodes,

      dependencyNodes:
        response.dependencyNodes?.length
          ? response.dependencyNodes
          : previous.dependencyNodes,

      securityFindings:
        response.securityFindings?.length
          ? response.securityFindings
          : previous.securityFindings,

      reviewItems:
        response.reviewItems?.length
          ? response.reviewItems
          : previous.reviewItems,

      chatMessages:
        response.chatMessages?.length
          ? response.chatMessages
          : previous.chatMessages,

      searchResults:
        response.searchResults?.length
          ? response.searchResults
          : previous.searchResults,

      message:
        response.message ||
        'Repository analysis completed successfully.',

      isLoading: false,
      status: response.status || 'analyzed',
      source: response.source || 'fastapi-backend'
    }));

  } catch (error) {
    console.error('Repository analysis error:', error);

    setAnalysisState((previous) => ({
      ...previous,
      message: `Analysis failed: ${error.message}`,
      isLoading: false,
      status: 'error'
    }));
  }
};

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home hero={homeHeroContent} workflowSteps={pipelineSteps} overview={{ repository: analysisState.repository, stats: analysisState.stats, status: analysisState.status, message: analysisState.message }} presets={repositoryPresets} initialSearchResults={analysisState.searchResults} initialChatMessages={analysisState.chatMessages} selectedRepo={analysisState.repository} onAnalyze={handleAnalyze} />} />
          <Route path="/dashboard" element={<Dashboard analysis={analysisState} />} />
          <Route path="/repository-analysis" element={<RepositoryAnalysis analysis={analysisState} />} />
          <Route path="/assistant" element={<Assistant messages={analysisState.chatMessages} />} />
          <Route path="/architecture" element={<Architecture nodes={analysisState.architectureNodes} />} />
          <Route path="/dependencies" element={<Dependencies nodes={analysisState.dependencyNodes} />} />
          <Route path="/security" element={<Security findings={analysisState.securityFindings} />} />
          <Route path="/code-review" element={<CodeReview reviews={analysisState.reviewItems} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
