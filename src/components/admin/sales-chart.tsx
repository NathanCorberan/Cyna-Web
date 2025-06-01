import { useEffect, useRef } from "react"

export default function SalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const width = 800
  const height = 300

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Simuler des données de ventes
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    const salesData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 500) + 100)

    // Dessiner le graphique
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height)

    // Dessiner les axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#e2e8f0"
    ctx.stroke()

    // Trouver les valeurs min et max
    const maxSales = Math.max(...salesData)
    const minSales = Math.min(...salesData)
    const range = maxSales - minSales || 1

    // Dessiner les lignes horizontales et les étiquettes
    const numLines = 5
    for (let i = 0; i <= numLines; i++) {
      const y = padding + (chartHeight * i) / numLines
      const value = Math.round(maxSales - (range * i) / numLines)

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.strokeStyle = "#e2e8f0"
      ctx.stroke()

      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${value} €`, padding - 5, y + 3)
    }

    // Dessiner les étiquettes des jours
    for (let i = 0; i < days.length; i += 5) {
      const x = padding + (chartWidth * i) / (days.length - 1)
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${days[i]}`, x, height - padding + 15)
    }

    // Dessiner la ligne de ventes
    ctx.beginPath()
    salesData.forEach((sale, i) => {
      const x = padding + (chartWidth * i) / (salesData.length - 1)
      const y = padding + chartHeight - (chartHeight * (sale - minSales)) / range

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.strokeStyle = "#302082"
    ctx.lineWidth = 2
    ctx.stroke()

    // Dessiner les points
    salesData.forEach((sale, i) => {
      const x = padding + (chartWidth * i) / (salesData.length - 1)
      const y = padding + chartHeight - (chartHeight * (sale - minSales)) / range

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#302082"
      ctx.fill()
    })
  }, [width, height])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-full"></canvas>
    </div>
  )
}
