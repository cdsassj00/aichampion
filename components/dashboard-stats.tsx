"use client"

import { useChampions } from "@/lib/champion-context"
import { gradeColors, type ChampionGrade } from "@/lib/types"

export function DashboardStats() {
  const { champions } = useChampions()

  const totalChampions = champions.length
  const gradeStats = champions.reduce(
    (acc, champion) => {
      acc[champion.grade] = (acc[champion.grade] || 0) + 1
      return acc
    },
    {} as Record<ChampionGrade, number>,
  )

  const StatCard = ({ title, count, grade }: { title: string; count: number; grade?: ChampionGrade }) => {
    const colors = grade ? gradeColors[grade] : { neon: "#10b981", bg: "from-green-400 to-green-600" }

    return (
      <div className="relative overflow-hidden rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-700/40 p-4">
        {/* 등급별 배경 그라데이션 */}
        {grade && <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-10`} />}
        <div className="relative z-10">
          <h3 className="text-xs font-medium text-gray-400 mb-1">{title}</h3>
          <p
            className="text-2xl font-bold"
            style={{
              color: grade === "블랙" ? "#9ca3af" : colors.neon,
              textShadow: `0 0 10px ${colors.neon}40`,
            }}
          >
            {count}
          </p>
        </div>
        {/* 등급별 테두리 글로우 */}
        {grade && (
          <div
            className="absolute inset-0 rounded-lg border-2 opacity-30"
            style={{
              borderColor: colors.neon,
              boxShadow: `0 0 15px ${colors.neon}30`,
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      <StatCard title="총 챔피언" count={totalChampions} grade={undefined} />
      <StatCard title="거점리더" count={gradeStats.거점리더 || 0} grade="거점리더" />
      <StatCard title="블랙" count={gradeStats.블랙 || 0} grade="블랙" />
      <StatCard title="블루" count={gradeStats.블루 || 0} grade="블루" />
      <StatCard title="그린" count={gradeStats.그린 || 0} grade="그린" />
    </div>
  )
}
