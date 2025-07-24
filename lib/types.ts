export type ChampionGrade = "거점리더" | "블랙" | "블루" | "그린"

export interface Champion {
  id: string
  name: string
  organization: string
  role: string
  grade: ChampionGrade
  specialties: string[]
  message: string
  profileImage?: string
  createdAt: string
}

export const gradeColors = {
  거점리더: {
    neon: "#ffffff",
    bg: "from-white/20 via-gray-100/10 to-white/20",
    border: "border-white/50",
    shadow: "shadow-white/20",
    glow: "hover:shadow-white/40",
    text: "text-white",
  },
  블랙: {
    neon: "#9ca3af",
    bg: "from-gray-400/20 via-gray-500/10 to-gray-600/20",
    border: "border-gray-400/50",
    shadow: "shadow-gray-400/20",
    glow: "hover:shadow-gray-400/40",
    text: "text-gray-300",
  },
  블루: {
    neon: "#3b82f6",
    bg: "from-blue-400/20 via-blue-500/10 to-blue-600/20",
    border: "border-blue-400/50",
    shadow: "shadow-blue-400/20",
    glow: "hover:shadow-blue-400/40",
    text: "text-blue-300",
  },
  그린: {
    neon: "#10b981",
    bg: "from-green-400/20 via-green-500/10 to-green-600/20",
    border: "border-green-400/50",
    shadow: "shadow-green-400/20",
    glow: "hover:shadow-green-400/40",
    text: "text-green-300",
  },
}
