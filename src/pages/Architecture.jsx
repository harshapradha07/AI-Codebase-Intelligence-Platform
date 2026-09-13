import ArchitectureDiagram from '../components/ArchitectureDiagram';

function Architecture({ nodes = [] }) {
  return (
    <div className="page-section active">
      <div className="hero">
        <h1>System <span className="gradient-text-1">Architecture</span></h1>
        <p>The interactive architecture map from the prototype is preserved here.</p>
      </div>
      <ArchitectureDiagram nodes={nodes} />
    </div>
  );
}

export default Architecture;
