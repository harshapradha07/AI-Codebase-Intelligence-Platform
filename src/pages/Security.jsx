import SecurityFindings from '../components/SecurityFindings';

function Security({ findings = [] }) {
  return (
    <div className="page-section active">
      <div className="hero">
        <h1>Security <span className="gradient-text-1">Signals</span></h1>
        <p>Security findings from the original dashboard experience remain available here.</p>
      </div>
      <SecurityFindings findings={findings} />
    </div>
  );
}

export default Security;
