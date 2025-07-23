"use client"

import { useEffect, useRef } from "react"

export function WaveLines() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Create SVG paths for the wave lines
    const svg = svgRef.current
    const width = svg.clientWidth
    const height = svg.clientHeight

    // Clear existing paths
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    // Create multiple wave lines with different colors and animations
    const createWaveLine = (
      color: string,
      opacity: number,
      animationDelay: number,
      yOffset: number,
      amplitude: number,
      frequency: number,
    ) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

      // Generate wave path
      let d = `M0,${height / 2 + yOffset}`

      for (let x = 0; x <= width; x += 10) {
        const y = Math.sin(x * frequency) * amplitude + height / 2 + yOffset
        d += ` L${x},${y}`
      }

      path.setAttribute("d", d)
      path.setAttribute("stroke", color)
      path.setAttribute("stroke-width", "1")
      path.setAttribute("fill", "none")
      path.setAttribute("opacity", opacity.toString())

      // Add animation
      const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate")
      animate.setAttribute("attributeName", "d")
      animate.setAttribute("dur", `${10 + Math.random() * 5}s`)
      animate.setAttribute("repeatCount", "indefinite")
      animate.setAttribute("begin", `${animationDelay}s`)

      // Generate second wave path for animation
      let d2 = `M0,${height / 2 + yOffset}`

      for (let x = 0; x <= width; x += 10) {
        const y = Math.sin(x * frequency + Math.PI) * amplitude + height / 2 + yOffset
        d2 += ` L${x},${y}`
      }

      animate.setAttribute("values", `${d};${d2};${d}`)

      path.appendChild(animate)
      svg.appendChild(path)
    }

    // Create multiple wave lines
    const colors = ["#00ff88", "#00ccff", "#8800ff", "#ff00cc"]

    for (let i = 0; i < 30; i++) {
      const color = colors[i % colors.length]
      const opacity = 0.1 + Math.random() * 0.3
      const animationDelay = Math.random() * 5
      const yOffset = -100 + Math.random() * 200
      const amplitude = 20 + Math.random() * 40
      const frequency = 0.005 + Math.random() * 0.01

      createWaveLine(color, opacity, animationDelay, yOffset, amplitude, frequency)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="wave-lines-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    ></svg>
  )
}
