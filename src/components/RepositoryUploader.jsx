import { useEffect, useState } from 'react';

function RepositoryUploader({ selectedRepo, onAnalyze, onPresetSelect, presets = [] }) {
  const [repo, setRepo] = useState(selectedRepo || '');

  useEffect(() => {
    setRepo(selectedRepo || '');
  }, [selectedRepo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnalyze(repo);
  };

  const handleChange = (event) => {
    setRepo(event.target.value);
  };

  return (
    <div className="upload-card">
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-input-wrapper">
          <span className="upload-input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </span>
          <input
            type="text"
            className="upload-input"
            placeholder="github.com/username/repository"
            value={repo}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary" type="submit">Analyze Repo</button>
      </form>
      <div className="demo-presets">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.5rem' }}>Or try presets:</span>
        {presets.map((preset) => (
          <button key={preset} className="preset-btn" type="button" onClick={() => onPresetSelect(preset)}>{preset}</button>
        ))}
      </div>
    </div>
  );
}

export default RepositoryUploader;
