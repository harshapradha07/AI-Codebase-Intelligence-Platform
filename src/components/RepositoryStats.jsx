function RepositoryStats({ stats = [] }) {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={stat.label} className="stat-widget">
          <div className="stat-icon">
            {index === 0 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            )}
            {index === 1 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            )}
            {index === 2 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            )}
            {index === 3 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18" />
                <path d="M3 12h18" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </div>
          <div className="stat-info">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-val">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RepositoryStats;
