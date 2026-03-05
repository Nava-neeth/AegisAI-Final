import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function Dashboard() {

  const [metrics, setMetrics] = useState({
    cpu: 0,
    ram: 0,
    disk: 0
  })

  const [history, setHistory] = useState([])

  useEffect(() => {

    let mounted = true

    const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0))

    const fetchMetrics = async () => {
      try {

        const response = await fetch("http://127.0.0.1:8000/status")

        if (!response.ok) {
          console.error("Server error:", response.status)
          return
        }

        const data = await response.json()

        if (!mounted) return

        const newData = {
          time: new Date().toLocaleTimeString([], { hour12: false }),
          cpu: clamp(data.cpu),
          ram: clamp(data.memory),
          disk: clamp(data.disk)
        }

        setMetrics(newData)

        setHistory(prev => {
          const updated = [...prev, newData]
          if (updated.length > 15) updated.shift()
          return updated
        })

      } catch (error) {
        console.error("Backend connection failed:", error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 2000)

    return () => {
      mounted = false
      clearInterval(interval)
    }

  }, [])

  return (
    <div style={{ display: "flex", gap: "30px" }}>

      <div style={{ flex: 3 }}>

        <h2 style={{ marginBottom: "30px", fontSize: "24px" }}>
          System Dashboard
        </h2>

        <div style={{ display: "flex", gap: "25px", marginBottom: "40px" }}>
          <MetricCard title="CPU Usage" value={metrics.cpu} />
          <MetricCard title="RAM Usage" value={metrics.ram} />
          <MetricCard title="Disk Usage" value={metrics.disk} />
        </div>

        <div style={chartContainer}>
          <h3 style={{ marginBottom: "20px" }}>Live Usage Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="time" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#22c55e" />
              <Line type="monotone" dataKey="ram" stroke="#f59e0b" />
              <Line type="monotone" dataKey="disk" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>

      <div style={{ flex: 1 }}>
        <AlertPanel cpu={metrics.cpu} ram={metrics.ram} disk={metrics.disk} />
      </div>

    </div>
  )
}

/* ------------------ Metric Card ------------------ */

function MetricCard({ title, value }) {

  const safeValue = Math.max(0, Math.min(100, value))

  const barColor =
    safeValue < 50 ? "#22c55e" :
    safeValue < 80 ? "#f59e0b" :
    "#ef4444"

  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: "15px" }}>{title}</h3>

      <div style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>
        {safeValue.toFixed(1)}%
      </div>

      <div style={progressBackground}>
        <div
          style={{
            ...progressFill,
            width: `${safeValue}%`,
            backgroundColor: barColor
          }}
        />
      </div>
    </div>
  )
}

/* ------------------ Alert Panel ------------------ */

function AlertPanel({ cpu, ram, disk }) {

  const alerts = []

  if (cpu > 80) alerts.push("High CPU usage detected")
  if (ram > 80) alerts.push("High RAM usage detected")
  if (disk > 85) alerts.push("Disk almost full")

  const status =
    alerts.length === 0 ? "Healthy" :
    alerts.length === 1 ? "Warning" :
    "Critical"

  const statusColor =
    status === "Healthy" ? "#22c55e" :
    status === "Warning" ? "#f59e0b" :
    "#ef4444"

  return (
    <div style={alertContainer}>
      <h3 style={{ marginBottom: "20px" }}>System Status</h3>

      <div style={{
        fontSize: "18px",
        marginBottom: "15px",
        fontWeight: "bold",
        color: statusColor
      }}>
        {status}
      </div>

      {alerts.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No active alerts</p>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} style={alertItem}>
            {alert}
          </div>
        ))
      )}
    </div>
  )
}

/* ------------------ Styles ------------------ */

const cardStyle = {
  backgroundColor: "#1e293b",
  color: "white",
  padding: "25px",
  borderRadius: "12px",
  width: "260px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
}

const progressBackground = {
  width: "100%",
  height: "8px",
  backgroundColor: "#334155",
  borderRadius: "10px",
  overflow: "hidden"
}

const progressFill = {
  height: "100%",
  transition: "width 0.5s ease"
}

const chartContainer = {
  backgroundColor: "#1e293b",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  color: "white"
}

const alertContainer = {
  backgroundColor: "#1e293b",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  color: "white"
}

const alertItem = {
  backgroundColor: "#334155",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
  fontSize: "14px"
}

export default Dashboard