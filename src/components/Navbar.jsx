import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <header>
      <div className="logo" onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/')}>
        <div className="logo-icon">
          <div className="logo-circle" />
          <div className="logo-circle-inner" />
        </div>
        <span>SYNAPSE AI</span>
      </div>

      <nav className="nav-links">
        <NavLink className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`} to="/">
          Interactive Workflow
        </NavLink>
        <NavLink className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`} to="/dashboard">
          Repository Insights
        </NavLink>
      </nav>

      <div className="header-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Run Pipeline Demo</button>
      </div>
    </header>
  );
}

export default Navbar;
