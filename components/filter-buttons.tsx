"use client"

import { type ChampionGrade, gradeColors } from "@/lib/types"

interface FilterButtonsProps {
  selectedGrade: ChampionGrade | "ALL"
  onGradeChange: (grade: ChampionGrade | "ALL") => void
}

export function FilterButtons({ selectedGrade, onGradeChange }: FilterButtonsProps) {
  const grades: (ChampionGrade | "ALL")[] = ["ALL", "거점리더", "블랙", "블루", "그린"]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {grades.map((grade) => {
        const isSelected = selectedGrade === grade
        const colors = grade !== "ALL" ? gradeColors[grade] : { neon: "#10b981" }

        return (
          <button
            key={grade}
            onClick={() => onGradeChange(grade)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
              isSelected
                ? grade === "블랙"
                  ? "text-white bg-gray-800 border-gray-600"
                  : "text-black font-bold"
                : "text-gray-400 hover:text-white bg-gray-800/50 border-gray-600 hover:border-gray-500"
            }`}
            style={
              isSelected && grade !== "블랙" && grade !== "ALL"
                ? {
                    backgroundColor: colors.neon,
                    borderColor: colors.neon,
                    boxShadow: `0 0 20px ${colors.neon}40`,
                  }
                : isSelected && grade === "ALL"
                  ? {
                      backgroundColor: colors.neon,
                      borderColor: colors.neon,
                      boxShadow: `0 0 20px ${colors.neon}40`,
                      color: "black",
                    }
                  : {}
            }
          >
            {grade === "ALL" ? "전체" : grade}
          </button>
        )
      })}
    </div>
  )
}
