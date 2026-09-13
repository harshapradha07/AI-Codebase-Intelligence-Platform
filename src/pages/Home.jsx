import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RepositoryUploader from '../components/RepositoryUploader';

function Home({
  hero = {},
  workflowSteps = [],
  overview = {},
  presets = [],
  initialSearchResults = [],
  initialChatMessages = [],
  selectedRepo: selectedRepoProp = '',
  onAnalyze
}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState(selectedRepoProp || overview.repository || '');
  const [statusText, setStatusText] = useState('Ready');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeScreen, setActiveScreen] = useState('step1');
  const [stepMessages, setStepMessages] = useState([]);
  const [embeddingProgress, setEmbeddingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(initialSearchResults);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [searchVisible, setSearchVisible] = useState(false);
  const [architectureVisible, setArchitectureVisible] = useState(false);

  const stepDetails = useMemo(() => workflowSteps, [workflowSteps]);

  useEffect(() => {
    if (selectedRepoProp) {
      setSelectedRepo(selectedRepoProp);
    }
  }, [selectedRepoProp]);

  useEffect(() => {
    if (currentStep === 2) {
      const cloneCommand = selectedRepo ? `git clone --depth 1 https://github.com/${selectedRepo.replace(/^https?:\/\//i, '').replace(/^github\.com\//i, '').replace(/\.git$/i, '')}.git .` : 'git clone --depth 1 https://github.com/owner/repository.git .';
      setStatusText('Cloning Repository...');
      setStepMessages([
        cloneCommand,
        'Extracting file hierarchy mapping structures...',
        'Repository cloned and metadata indexed successfully.'
      ]);
    }

    if (currentStep === 3) {
      setStatusText('Chunking files...');
    }

    if (currentStep === 4) {
      setStatusText('Generating Vector Embeddings...');
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setEmbeddingProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 250);
    }

    if (currentStep === 6) {
      setStatusText('Performing Semantic Search...');
      const loadSearch = async () => {
        setSearchResults(initialSearchResults);
        setSearchQuery('How is file splitting chunk logic configured?');
        setSearchVisible(true);
      };
      loadSearch();
    }

    if (currentStep === 7) {
      setStatusText('Generating LLM Response...');
      const loadChat = async () => {
        setChatMessages(initialChatMessages);
      };
      loadChat();
    }

    if (currentStep === 8) {
      setStatusText('Drawing Architecture Layout...');
      setArchitectureVisible(true);
    }

    if (currentStep === 9) {
      setStatusText('Synthesizing Core Security & Reviews...');
    }
  }, [currentStep, initialChatMessages, initialSearchResults, selectedRepo]);

  useEffect(() => {
    setProgressPercent(((currentStep - 1) / 8) * 100);
    setActiveScreen(`step${currentStep}`);
  }, [currentStep]);

  const handleAnalyze = async (repo) => {
    const normalizedRepo = repo && repo.trim() ? repo.trim() : selectedRepo;
    setSelectedRepo(normalizedRepo);
    setStatusText('Scanning repository structure...');
    setIsDemoRunning(true);
    setCurrentStep(1);
    setEmbeddingProgress(0);
    setSearchResults([]);
    setSearchVisible(false);
    setArchitectureVisible(false);
    setStepMessages([]);

    if (onAnalyze) {
      await onAnalyze(normalizedRepo);
    }

    navigate('/dashboard');
  };

  const handlePresetSelect = (repo) => {
    const normalizedRepo = repo && repo.trim() ? repo.trim() : selectedRepo;
    setSelectedRepo(normalizedRepo);
    handleAnalyze(normalizedRepo);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 2:
        return (
          <div className="terminal-window">
            {stepMessages.map((line, index) => (
              <div key={`${line}-${index}`} className={`terminal-line ${index === stepMessages.length - 1 ? 'success' : 'cmd'}`}>
                {line}
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="chunking-container">
            <div className="code-viewer-panel">
              <div className="code-viewer-header">
                <span>src/utils/chunker.js</span>
                <span>JavaScript</span>
              </div>
              <div className="code-scroller">
                <span className="code-line chunk-highlight-1">{'class ChunkProcessor {'}</span>
                <span className="code-line chunk-highlight-1">{'  constructor(chunkSize = 500, overlap = 50) {'}</span>
                <span className="code-line chunk-highlight-2">{'    this.chunkSize = chunkSize;'}</span>
                <span className="code-line chunk-highlight-2">{'    this.overlap = overlap;'}</span>
                <span className="code-line">{'  }'}</span>
                <span className="code-line chunk-highlight-2">{'  splitFile(fileContent, filePath) {'}</span>
                <span className="code-line chunk-highlight-2">{'    const lines = fileContent.split(\'\\n\');'}</span>
                <span className="code-line chunk-highlight-2">{'    const chunks = [];'}</span>
                <span className="code-line chunk-highlight-3">{'    let currentChunk = [];'}</span>
                <span className="code-line chunk-highlight-3">{'    let currentLength = 0;'}</span>
                <span className="code-line">{'  }'}</span>
              </div>
            </div>
            <div className="chunk-stats-panel">
              <div className="stats-card">
                <div className="stats-title">Extracted chunks</div>
                <div className="stats-value">4</div>
              </div>
              <div className="stats-card" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="stats-title" style={{ marginBottom: '0.75rem' }}>Semantic Blocks</div>
                <div className="chunk-list">
                  <div className="chunk-badge c1 active">Class Constructor (L1-L5)</div>
                  <div className="chunk-badge c2">splitFile logic (L6-L17)</div>
                  <div className="chunk-badge c2">splitFile validation (L18-L23)</div>
                  <div className="chunk-badge c3">compileChunk helper (L24-L30)</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="embeddings-layout">
            <div className="matrix-flow-box">
              <div className="stats-title">Input Tokens Stream</div>
              <div className="token-stream">
                {['class', 'ChunkProcessor', 'constructor', 'splitFile', 'fileContent', 'filePath'].map((word, idx) => (
                  <span key={word} className={`token-word ${idx === 0 ? 'active' : ''}`}>{word}</span>
                ))}
              </div>
              <div className="embedding-vector-box">
                <div className="stats-title">AI Dimension Vectors (1536-d)</div>
                <div className="vector-row">
                  <span className="vector-label">Token #1</span>
                  <div className="vector-brackets">[0.0825, -0.4294, 0.9251, -0.1983, ...]</div>
                </div>
                <div className="vector-row">
                  <span className="vector-label">Token #2</span>
                  <div className="vector-brackets">[0.0825, -0.4294, 0.9251, -0.1983, ...]</div>
                </div>
                <div className="vector-row">
                  <span className="vector-label">Token #3</span>
                  <div className="vector-brackets">[0.0825, -0.4294, 0.9251, -0.1983, ...]</div>
                </div>
              </div>
            </div>
            <div className="progress-footer">
              <div className="progress-header-info">
                <span>Embedding progress</span>
                <span>{embeddingProgress}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${embeddingProgress}%` }} />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="db-layout">
            <div className="db-canvas-wrapper">
              <div className="vector-canvas" style={{ minHeight: '280px', background: 'radial-gradient(circle at center, rgba(139,92,246,0.12), transparent 60%)' }} />
              <div className="canvas-instructions">3D Coordinate ChromaDB Space</div>
            </div>
            <div className="db-stats-panel">
              <div className="stats-card">
                <div className="stats-title">Database Vector Engine</div>
                <div className="stats-value" style={{ fontSize: '1.25rem' }}>ChromaDB (Local)</div>
              </div>
              <div className="stats-card" style={{ flexGrow: 1 }}>
                <div className="stats-title">DB Collection Stats</div>
                <div className="db-status-row"><span>Collection Name:</span><span className="db-status-val">synapse_embeddings</span></div>
                <div className="db-status-row"><span>Indexed Nodes:</span><span className="db-status-val">150 vectors</span></div>
                <div className="db-status-row"><span>Distance Metric:</span><span className="db-status-val">Cosine</span></div>
                <div className="db-status-row"><span>Indexing Status:</span><span className="db-status-val green">Indexed</span></div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="search-sim-wrapper">
            <div className="search-sim-bar-wrapper">
              <span className="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </span>
              <input type="text" className="search-sim-bar" value={searchQuery} readOnly placeholder="Type query for semantic matches..." />
            </div>
            <div className="search-results-list">
              {searchResults.map((result) => (
                <div key={result.path} className="search-result-item animate">
                  <div className="search-result-header">
                    <span className="result-file-path">{result.path}</span>
                    <span className="result-score">Cosine Similarity: {result.score}</span>
                  </div>
                  <div className="result-preview">{result.preview}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="chat-sim-wrapper">
            <div className="chat-sim-messages">
              {chatMessages.map((message, index) => (
                <div key={`${message.sender}-${index}`} className={`chat-msg ${message.type || 'assistant'}`}>
                  <span className="chat-msg-sender">{message.sender}</span>
                  <div className="chat-msg-bubble">{message.text}</div>
                  {message.refs?.length > 0 && (
                    <div className="chat-msg-references">
                      {message.refs.map((ref) => (
                        <span key={ref} className="chat-ref-tag">{ref}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="chat-sim-input-area">
              <input type="text" className="chat-sim-input" readOnly placeholder="Awaiting query route..." />
            </div>
          </div>
        );
      case 8:
        return (
          <div className="arch-sim-wrapper">
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
                <g id="archNodeUpload"><rect x="10" y="145" width="100" height="60" rx="8" className="arch-node active" /><text x="60" y="175" className="arch-node-label">1. Upload API</text><text x="60" y="190" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">Git Scanner</text></g>
                <g id="archNodeCloner"><rect x="170" y="145" width="100" height="60" rx="8" className="arch-node active" /><text x="220" y="170" className="arch-node-label">2. Cloner</text><text x="220" y="182" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">Metadata</text><text x="220" y="192" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">Extractor</text></g>
                <g id="archNodeDB"><rect x="330" y="145" width="80" height="60" rx="8" className="arch-node active" /><text x="370" y="175" className="arch-node-label">3. Vector DB</text><text x="370" y="190" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">ChromaDB</text></g>
                <g id="archNodeLLM"><rect x="450" y="75" width="100" height="60" rx="8" className="arch-node active" /><text x="500" y="105" className="arch-node-label">4. AI Orchestrator</text><text x="500" y="120" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">LLM Agent</text></g>
                <g id="archNodeUI"><rect x="450" y="215" width="100" height="60" rx="8" className="arch-node active" /><text x="500" y="245" className="arch-node-label">5. Dashboard UI</text><text x="500" y="260" fill="var(--text-muted)" fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle">Interface</text></g>
              </svg>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="intel-hub-layout">
            <div className="intel-hub-tabs">
              <button className="intel-tab active">Dependency Graph</button>
              <button className="intel-tab">Hotspot Analysis</button>
              <button className="intel-tab">Security Review</button>
              <button className="intel-tab">Code Review</button>
            </div>
            <div className="intel-hub-content">
              <div className="intel-pane active">
                <div className="hotspot-list">
                  <div className="hotspot-item"><div className="hotspot-name">src/api/code/chunker.ts</div><div className="hotspot-bar-wrapper"><div className="hotspot-bar-fill high" style={{ width: '86%' }} /></div><div className="hotspot-score high">86%</div></div>
                  <div className="hotspot-item"><div className="hotspot-name">src/api/ai/agent.ts</div><div className="hotspot-bar-wrapper"><div className="hotspot-bar-fill medium" style={{ width: '62%' }} /></div><div className="hotspot-score medium">62%</div></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="sim-step-1-content">
            <div className="repo-radar">
              <div className="radar-circle" />
              <div className="radar-circle" />
              <div className="radar-circle" />
              <div className="radar-sweep" />
              <div className="radar-dot" />
              <div className="radar-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
              </div>
            </div>
            <h3>{stepDetails[0].title}</h3>
            <p className="sim-step-1-status">{stepDetails[0].description}</p>
          </div>
        );
    }
  };

  return (
    <div className="page-section active">
      <div className="hero">
        <h1>AI Codebase <span className="gradient-text-1">Intelligence</span> & <span className="gradient-text-2">Mapping</span></h1>
        <p>{hero.description}</p>
        <RepositoryUploader selectedRepo={selectedRepo} onAnalyze={handleAnalyze} onPresetSelect={handlePresetSelect} presets={presets} />
      </div>

      <div className="workspace-grid">
        <Sidebar currentStep={currentStep} onSelectStep={setCurrentStep} isDemoRunning={isDemoRunning} progressPercent={progressPercent} steps={stepDetails} />

        <section className="simulator-panel active-glow-primary">
          <div className="sim-header">
            <div className="sim-window-dots">
              <div className="sim-dot red" />
              <div className="sim-dot yellow" />
              <div className="sim-dot green" />
            </div>
            <div className="sim-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
              <span>Engine Simulator</span>
            </div>
            <div className="sim-status-badge">
              <div className="sim-status-dot active" />
              <span>{statusText}</span>
            </div>
          </div>

          <div className="sim-body">
            <div className={`sim-step-screen ${activeScreen === 'step1' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step2' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step3' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step4' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step5' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step6' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step7' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step8' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
            <div className={`sim-step-screen ${activeScreen === 'step9' ? 'active' : ''}`}>
              {renderStepContent()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
