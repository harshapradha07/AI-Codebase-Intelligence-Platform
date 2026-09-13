import RepositoryStats from '../components/RepositoryStats';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import DependencyGraph from '../components/DependencyGraph';

function RepositoryAnalysis({ analysis = {} }) {
  const stats = analysis.stats || [];
  const architectureNodes = analysis.architectureNodes || [];
  const dependencyNodes = analysis.dependencyNodes || [];
  const repositoryLabel = analysis.repositoryLabel || analysis.repository || 'Repository';
  const owner = analysis.owner || '—';
  const files = analysis.files || '—';
  const languages = analysis.languages?.length ? analysis.languages.join(', ') : '—';

  return (
    <div className="page-section active">
      <div className="hero">
        <h1>Repository <span className="gradient-text-1">Analysis</span></h1>
        <p>Repository-level diagnostics and dependency mapping remain available in the React architecture.</p>
      </div>
      <div className="dashboard-content-area">
        <div className="stats-card" style={{ marginBottom: '1rem' }}>
          <div className="stats-title">Current Repository</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{repositoryLabel}</div>
          <div className="db-status-row"><span>Owner</span><span className="db-status-val">{owner}</span></div>
          <div className="db-status-row"><span>Files</span><span className="db-status-val">{files}</span></div>
          <div className="db-status-row"><span>Languages</span><span className="db-status-val">{languages}</span></div>
        </div>
        <RepositoryStats stats={stats} />
        <ArchitectureDiagram nodes={architectureNodes} />
        <DependencyGraph nodes={dependencyNodes} />
      </div>
    </div>
  );
}

export default RepositoryAnalysis;
