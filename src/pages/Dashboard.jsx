import { useState } from 'react';
import RepositoryStats from '../components/RepositoryStats';
import AIChat from '../components/AIChat';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import DependencyGraph from '../components/DependencyGraph';
import SecurityFindings from '../components/SecurityFindings';
import CodeReviewPanel from '../components/CodeReviewPanel';

function Dashboard({ analysis = {} }) {
  const [activePane, setActivePane] = useState('overview');
  const stats = analysis.stats || [];
  const architectureNodes = analysis.architectureNodes || [];
  const dependencyNodes = analysis.dependencyNodes || [];
  const securityFindings = analysis.securityFindings || [];
  const reviewItems = analysis.reviewItems || [];
  const chatMessages = analysis.chatMessages || [];
  const repositoryLabel = analysis.repositoryLabel || analysis.repository || 'Repository';
  const owner = analysis.owner || '—';
  const name = analysis.name || repositoryLabel.split('/').pop() || 'Repository';
  const files = analysis.files || '—';
  const languages = analysis.languages?.length ? analysis.languages.join(', ') : '—';
  const activity = analysis.activity?.[0]?.value || '—';
  const mode = analysis.source === 'github-api' ? 'Live GitHub metadata' : 'Simulated repository analysis';

  const askAssistant = async (question) => {
     console.log("🔥 USING PORT 8002");
  console.log("🔥 URL =", "http://127.0.0.1:8002/assistant/ask");
  const response = await fetch("http://127.0.0.1:8002/assistant/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question
    })
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  const data = await response.json();

  return {
    text: data.answer || data.response || data.message || "No response received.",
    refs: []
  };
};
  const panes = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <>
          <RepositoryStats stats={stats} />
          <ArchitectureDiagram nodes={architectureNodes} />
        </>
      )
    },
    {
      id: 'architecture',
      label: 'Architecture',
      content: <ArchitectureDiagram nodes={architectureNodes} />
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      content: <DependencyGraph nodes={dependencyNodes} />
    },
    {
      id: 'security',
      label: 'Security',
      content: <SecurityFindings findings={securityFindings} />
    },
    {
      id: 'review',
      label: 'Code Review',
      content: <CodeReviewPanel reviews={reviewItems} />
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      content: (
    <AIChat
      messages={chatMessages}
      onSend={askAssistant}
    />
  )
    }
  ];

  return (
    <div className="page-section active">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="dash-menu-title">Repository Insights</div>
          {panes.map((pane) => (
            <button
              key={pane.id}
              type="button"
              className={`dash-menu-item ${activePane === pane.id ? 'active' : ''}`}
              onClick={() => setActivePane(pane.id)}
            >
              {pane.label}
            </button>
          ))}
        </aside>
        <div className="dashboard-content-area">
          <div className="stats-card" style={{ marginBottom: '1rem' }}>
            <div className="stats-title">Active Repository</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>{repositoryLabel}</div>
            <div className="db-status-row"><span>Owner</span><span className="db-status-val">{owner}</span></div>
            <div className="db-status-row"><span>Repository</span><span className="db-status-val">{name}</span></div>
            <div className="db-status-row"><span>Files</span><span className="db-status-val">{files}</span></div>
            <div className="db-status-row"><span>Languages</span><span className="db-status-val">{languages}</span></div>
            <div className="db-status-row"><span>Activity</span><span className="db-status-val">{activity}</span></div>
            <div className="db-status-row"><span>Analysis mode</span><span className="db-status-val">{mode}</span></div>
          </div>
          {panes.map((pane) => (
            <div key={pane.id} className={`dash-pane ${activePane === pane.id ? 'active' : ''}`}>
              {pane.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
