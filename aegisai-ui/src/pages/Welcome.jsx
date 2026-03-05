import { useNavigate } from "react-router-dom"
import { useState } from "react"

function Welcome() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleEnter = () => {

    setLoading(true)

    let value = 0

    const interval = setInterval(() => {

      value += 5
      setProgress(value)

      if (value >= 100) {
        clearInterval(interval)
        sessionStorage.setItem("visited", "true")
        navigate("/dashboard", { replace: true })
      }

    }, 80)
  }

  return (
    <div style={wrapper}>

      {/* floating particles */}
      <div style={particles}></div>

      {!loading && (

        <div style={content}>

          <h1 style={title}>
            Welcome to AegisAI
          </h1>

          <p style={subtitle}>
            Autonomous Monitoring & Threat Intelligence System
          </p>

          <button
            style={button}
            onClick={handleEnter}
          >
            Enter System
          </button>

        </div>

      )}

      {loading && (

        <div style={bootScreen}>

          <h2 style={bootTitle}>
            Initializing AegisAI...
          </h2>

          <div style={progressBarBackground}>

            <div
              style={{
                ...progressBar,
                width: `${progress}%`
              }}
            />

          </div>

          <p style={progressText}>
            {progress}%
          </p>

        </div>

      )}

    </div>
  )
}

/* -------- Background Wrapper -------- */

const wrapper = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(270deg,#020617,#0f172a,#020617)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 12s ease infinite",
  color: "white",
  overflow: "hidden",
  position: "relative"
}

/* -------- Floating Particles -------- */

const particles = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage:
    "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
  animation: "particlesMove 40s linear infinite",
  opacity: 0.3
}

/* -------- Content -------- */

const content = {
  textAlign: "center",
  zIndex: 2
}

const title = {
  fontSize: "56px",
  marginBottom: "20px",
  textShadow: "0 0 30px #22c55e",
  animation: "titleFloat 3s ease-in-out infinite"
}

const subtitle = {
  fontSize: "18px",
  marginBottom: "40px",
  color: "#94a3b8"
}

/* -------- Button -------- */

const button = {
  padding: "18px 60px",
  fontSize: "18px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#22c55e",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 0 20px #22c55e",
  transition: "all 0.35s ease"
}

/* -------- Boot Screen -------- */

const bootScreen = {
  textAlign: "center",
  zIndex: 2
}

const bootTitle = {
  fontSize: "34px",
  marginBottom: "30px",
  textShadow: "0 0 25px #22c55e"
}

/* -------- Progress Bar -------- */

const progressBarBackground = {
  width: "420px",
  height: "12px",
  backgroundColor: "#1e293b",
  borderRadius: "10px",
  overflow: "hidden",
  margin: "0 auto"
}

const progressBar = {
  height: "100%",
  backgroundColor: "#22c55e",
  boxShadow: "0 0 15px #22c55e",
  transition: "width 0.2s ease"
}

const progressText = {
  marginTop: "15px",
  color: "#94a3b8"
}

export default Welcome