function DependencyGraph({ nodes = [] }) {
  return (
    <div className="dash-card">
      <div className="dash-card-title">Dependency Graph</div>
      <svg className="dep-graph-svg" viewBox="0 0 400 220">
        <rect x="20" y="40" width="120" height="60" rx="10" fill="rgba(255,255,255,0.03)" stroke="var(--border-color)" />
        <rect x="220" y="40" width="120" height="60" rx="10" fill="rgba(255,255,255,0.03)" stroke="var(--border-color)" />
        <rect x="20" y="140" width="120" height="60" rx="10" fill="rgba(255,255,255,0.03)" stroke="var(--border-color)" />
        <rect x="220" y="140" width="120" height="60" rx="10" fill="rgba(255,255,255,0.03)" stroke="var(--border-color)" />
        <line x1="140" y1="70" x2="220" y2="70" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
        <line x1="80" y1="100" x2="80" y2="140" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
        <line x1="280" y1="100" x2="280" y2="140" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
        <line x1="140" y1="170" x2="220" y2="170" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" />
        {nodes.map((node) => (
          <text key={node.id} x={node.id === 'auth' ? 80 : node.id === 'chunker' ? 280 : node.id === 'embedder' ? 80 : 280} y={node.id === 'db' ? 170 : 70} fill="var(--text-main)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle">{node.label}</text>
        ))}
      </svg>
    </div>
  );
}

export default DependencyGraph;
