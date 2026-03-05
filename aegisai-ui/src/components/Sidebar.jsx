import { NavLink } from "react-router-dom"

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>AegisAI</h2>

      <NavLink to="/dashboard" className="nav-link">
        Dashboard
      </NavLink>

      <NavLink to="/alerts" className="nav-link">
        Alerts
      </NavLink>

      <NavLink to="/system" className="nav-link">
        System
      </NavLink>
    </div>
  )
}

export default Sidebar