function Sidebar({ currentStep, onSelectStep, isDemoRunning, progressPercent, steps = [] }) {
  return (
    <aside className="steps-sidebar">
      <div className="sidebar-title">
        <span>Intelligence Engine</span>
        <span className="pipeline-status">{isDemoRunning ? 'Running' : 'Idle'}</span>
      </div>

      <div className="timeline">
        <div className="timeline-progress-bar" style={{ height: `${progressPercent}%` }} />
        {steps.map((step) => {
          const isActive = currentStep === step.step;
          const isCompleted = step.step < currentStep;
          return (
            <div
              key={step.step}
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} unlocked`}
              data-step={step.step}
              onClick={() => onSelectStep(step.step)}
            >
              <div className="step-bullet">
                <div className="step-bullet-inner" />
              </div>
              <div className="step-content">
                <div className="step-meta">Step {step.step}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;
