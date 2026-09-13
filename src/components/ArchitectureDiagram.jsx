function ArchitectureDiagram({ nodes = [] }) {
  return (
    <div className="dash-card">
      <div className="dash-card-title">Architecture Map</div>
      <div className="arch-sim-wrapper" style={{ minHeight: '320px' }}>
        <div className="arch-svg-container">
          <svg viewBox="0 0 600 350" width="100%" height="100%">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.25)" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#8b5cf6" />
              </marker>
            </defs>
            <path d="M110,175 L165,175" className="arch-edge active" markerEnd="url(#arrow-active)" />
            <path d="M270,175 L325,175" className="arch-edge active" markerEnd="url(#arrow-active)" />
            <path d="M370,140 L370,105 L445,105" className="arch-edge active" markerEnd="url(#arrow-active)" />
            <path d="M370,210 L370,245 L445,245" className="arch-edge active" markerEnd="url(#arrow-active)" />
            <path d="M470,135 L470,215" className="arch-edge active" markerEnd="url(#arrow-active)" />
            {nodes.map((node) => (
              <g key={node.id} id={`archNode${node.id}`}>
                <rect x={node.x - 50} y={node.y - 30} width="100" height="60" rx="8" className="arch-node active" />
                <text x={node.x} y={node.y - 5} className="arch-node-label">{node.label}</text>
                <text x={node.x} y={node.y + 10} fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">{node.sublabel}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ArchitectureDiagram;
