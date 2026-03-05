import { useEffect, useState } from "react"

function System() {

  const [status, setStatus] = useState("Healthy")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchStatus = async () => {
      try {

        const response = await fetch("http://127.0.0.1:8000/status")
        const data = await response.json()

        const cpu = data.cpu

        if (cpu > 85) {
          setStatus("Critical")
        } 
        else if (cpu > 65) {
          setStatus("Warning")
        } 
        else {
          setStatus("Healthy")
        }

        setLoading(false)

      } catch (error) {
        console.error("Status API error:", error)
      }
    }

    fetchStatus()

    const interval = setInterval(fetchStatus, 2000)

    return () => clearInterval(interval)

  }, [])

  const statusColor =
    status === "Healthy" ? "#22c55e" :
    status === "Warning" ? "#f59e0b" :
    "#ef4444"

  return (
    <div>
      <h2 style={{ marginBottom: "25px" }}>System Operations</h2>

      {loading ? (
        <div style={box}>
          Checking system status...
        </div>
      ) : (
        <div
          style={{
            ...box,
            backgroundColor: statusColor
          }}
        >
          Current System Status: {status}
        </div>
      )}
    </div>
  )
}

const box = {
  padding: "25px",
  borderRadius: "10px",
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
  backgroundColor: "#1e293b"
}

export default System