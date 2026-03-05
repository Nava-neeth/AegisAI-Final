import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Alerts from "./pages/Alerts"
import System from "./pages/System"
import Welcome from "./pages/Welcome"
import NotificationBell from "./components/NotificationBell"
import "./App.css"

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

function AppRoutes() {
  const [visited, setVisited] = useState(false)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited")
    if (hasVisited === "true") {
      setVisited(true)
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={visited ? <Navigate to="/dashboard" /> : <Welcome />} />
      <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/alerts" element={<MainLayout><Alerts /></MainLayout>} />
      <Route path="/system" element={<MainLayout><System /></MainLayout>} />
    </Routes>
  )
}

function MainLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <NotificationBell />
      <div className="content">
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  )
}

export default App