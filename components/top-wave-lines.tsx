"use client"

import { useEffect, useRef } from "react"

export function TopWaveLines() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = svgRef.current
    const width = svg.clientWidth || 1200
    const height = svg.clientHeight || 250

    // Clear existing paths
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    // Create horizontal wave lines for top section
    const createHorizontalWave = (
      color: string,
      opacity: number,
      yPosition: number,
      amplitude: number,
      frequency: number,
      animationDuration: number,
    ) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

      // Generate horizontal wave path
      let d = `M0,${yPosition}`

      for (let x = 0; x <= width; x += 5) {
        const y = Math.sin(x * frequency) * amplitude + yPosition
        d += ` L${x},${y}`
      }

      path.setAttribute("d", d)
      path.setAttribute("stroke", color)
      path.setAttribute("stroke-width", "1")
      path.setAttribute("fill", "none")
      path.setAttribute("opacity", opacity.toString())

      // Add flowing animation
      const animateTransform = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform")
      animateTransform.setAttribute("attributeName", "transform")
      animateTransform.setAttribute("type", "translate")
      animateTransform.setAttribute("values", `0,0;${width},0;0,0`)
      animateTransform.setAttribute("dur", `${animationDuration}s`)
      animateTransform.setAttribute("repeatCount", "indefinite")

      path.appendChild(animateTransform)
      svg.appendChild(path)
    }

    // Create multiple horizontal wave lines with different colors
    const colors = ["#ffffff", "#1a1a1a", "#3b82f6", "#10b981"]
    const gradeNames = ["거점리더", "블랙", "블루", "그린"]

    for (let i = 0; i < 40; i++) {
      const colorIndex = i % colors.length
      const color = colors[colorIndex]
      const opacity = 0.1 + Math.random() * 0.2
      const yPosition = 20 + i * 5 + Math.random() * 10
      const amplitude = 5 + Math.random() * 15
      const frequency = 0.01 + Math.random() * 0.02
      const animationDuration = 15 + Math.random() * 10

      createHorizontalWave(color, opacity, yPosition, amplitude, frequency, animationDuration)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="floating-wave-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 250"
      preserveAspectRatio="none"
    ></svg>
  )
}
