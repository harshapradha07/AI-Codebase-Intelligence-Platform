import AIChat from '../components/AIChat';

function Assistant({ messages = [] }) {
  return (
    <div className="page-section active">
      <div className="hero">
        <h1>AI <span className="gradient-text-2">Assistant</span></h1>
        <p>Conversational access to repository insights remains available here.</p>
      </div>
      <AIChat messages={messages} />
    </div>
  );
}

export default Assistant;
