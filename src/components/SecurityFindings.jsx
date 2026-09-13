import { useEffect, useState } from 'react';

function SecurityFindings({ findings: initialFindings = [] }) {
  const [findings, setFindings] = useState(initialFindings);

  useEffect(() => {
    setFindings(initialFindings);
  }, [initialFindings]);

  return (
    <div className="dash-card">
      <div className="dash-card-title">Security Findings</div>
      <div className="vuln-list">
        {findings.map((finding) => (
          <div key={finding.title} className="vuln-item">
            <div className="vuln-header">
              <div className="vuln-title">{finding.title}</div>
              <div className="vuln-severity">{finding.severity}</div>
            </div>
            <div className="vuln-desc">{finding.description}</div>
            <div className="vuln-code">{finding.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecurityFindings;
