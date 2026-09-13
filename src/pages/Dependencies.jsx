import DependencyGraph from '../components/DependencyGraph';

function Dependencies({ nodes = [] }) {
  return (
    <div className="page-section active">
      <div className="hero">
        <h1>Dependency <span className="gradient-text-2">Map</span></h1>
        <p>Dependency relationships and module connections are displayed in a dedicated route.</p>
      </div>
      <DependencyGraph nodes={nodes} />
    </div>
  );
}

export default Dependencies;
