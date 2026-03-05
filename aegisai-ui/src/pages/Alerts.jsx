import { useEffect, useState } from "react"

function Alerts() {

  const [systemAlerts, setSystemAlerts] = useState([])
  const [anomalyStatus, setAnomalyStatus] = useState(false)
  const [decision, setDecision] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    let mounted = true

    const fetchAlerts = async () => {
      try {

        const response = await fetch("http://127.0.0.1:8000/status")

        if (!response.ok) {
          throw new Error("API error")
        }

        const data = await response.json()

        if (!mounted) return

        const newAlerts = []

        // SYSTEM ALERT THRESHOLDS
        if (data.cpu > 85)
          newAlerts.push(`High CPU usage detected (${data.cpu}%)`)

        if (data.memory > 85)
          newAlerts.push(`High RAM usage detected (${data.memory}%)`)

        if (data.disk > 90)
          newAlerts.push(`Disk almost full (${data.disk}%)`)

        setSystemAlerts(newAlerts)

        // AI ANOMALY
        setAnomalyStatus(Boolean(data.anomaly))

        // ACTION DECISION
        setDecision(data.decision || null)

        setLoading(false)

      } catch (error) {
        console.error("Backend connection failed:", error)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 3000)

    return () => {
      mounted = false
      clearInterval(interval)
    }

  }, [])

  return (
    <div>

      <h2 style={{ marginBottom: "30px" }}>Alert Monitoring</h2>

      {loading && (
        <div style={neutralBox}>
          Checking system status...
        </div>
      )}

      {/* SYSTEM ALERTS */}
      <div style={sectionBox}>
        <h3>System Alerts</h3>

        {systemAlerts.length === 0 ? (
          <div style={healthyBox}>No active system alerts</div>
        ) : (
          systemAlerts.map((alert, index) => (
            <div key={index} style={alertBox}>
              {alert}
            </div>
          ))
        )}
      </div>

      {/* AI ANOMALY */}
      <div style={sectionBox}>
        <h3>AI Anomaly Status</h3>

        {anomalyStatus ? (
          <div style={warningBox}>
            ⚠ AI detected abnormal system behavior
          </div>
        ) : (
          <div style={healthyBox}>
            ✅ No anomaly detected
          </div>
        )}
      </div>

      {/* AUTOMATED ACTION */}
      <div style={sectionBox}>
        <h3>Automated Response</h3>

        {decision === "RESTART_SERVICE" && (
          <div style={actionBox}>
            🔄 Service restart triggered
          </div>
        )}

        {decision === "KILL_PROCESS" && (
          <div style={actionBox}>
            🔥 High CPU process terminated
          </div>
        )}

        {!decision && (
          <div style={neutralBox}>
            No automated action triggered
          </div>
        )}
      </div>

    </div>
  )
}

/* STYLES */

const sectionBox = {
  marginBottom: "30px"
}

const alertBox = {
  backgroundColor: "#ef4444",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "10px",
  color: "white"
}

const warningBox = {
  backgroundColor: "#f59e0b",
  padding: "15px",
  borderRadius: "8px",
  color: "white"
}

const actionBox = {
  backgroundColor: "#3b82f6",
  padding: "15px",
  borderRadius: "8px",
  color: "white"
}

const healthyBox = {
  backgroundColor: "#22c55e",
  padding: "15px",
  borderRadius: "8px",
  color: "white"
}

const neutralBox = {
  backgroundColor: "#64748b",
  padding: "15px",
  borderRadius: "8px",
  color: "white"
}

export default Alerts