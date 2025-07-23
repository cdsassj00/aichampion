export type ChampionGrade = "거점리더" | "블랙" | "블루" | "그린"

export interface Champion {
  id: string
  name: string
  organization: string
  role: string
  grade: ChampionGrade
  message: string
  specialties: string[]
  profileImage?: string
}

export const gradeColors = {
  거점리더: {
    bg: "from-white via-gray-100 to-gray-200",
    border: "border-white",
    text: "text-white",
    glow: "shadow-white/30",
    neon: "#ffffff",
  },
  블랙: {
    bg: "from-gray-800 via-gray-900 to-black",
    border: "border-gray-800",
    text: "text-gray-300",
    glow: "shadow-gray-800/30",
    neon: "#1a1a1a",
  },
  블루: {
    bg: "from-blue-400 via-blue-600 to-blue-800",
    border: "border-blue-400",
    text: "text-blue-300",
    glow: "shadow-blue-400/30",
    neon: "#3b82f6",
  },
  그린: {
    bg: "from-green-400 via-green-600 to-green-800",
    border: "border-green-400",
    text: "text-green-300",
    glow: "shadow-green-400/30",
    neon: "#10b981",
  },
}
