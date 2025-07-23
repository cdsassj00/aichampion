"use client"

import { useState } from "react"
import { type Champion, gradeColors } from "@/lib/types"
import { User, Circle, MoreHorizontal } from "lucide-react"

interface ChampionCardProps {
  champion: Champion
}

export function ChampionCard({ champion }: ChampionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const colors = gradeColors[champion.grade]

  return (
    <div
      className="relative w-full h-32 cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front Side - Horizontal layout like the image */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="h-full bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/40 overflow-hidden relative group-hover:border-gray-600/60 transition-all duration-300">
            <div className="flex h-full">
              {/* Left side - Profile image */}
              <div className="w-24 h-full flex-shrink-0 relative">
                <div className="w-full h-full bg-gray-700 flex items-center justify-center overflow-hidden rounded-l-lg">
                  {champion.profileImage ? (
                    <img
                      src={champion.profileImage || "/placeholder.svg"}
                      alt={champion.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Online status indicator */}
                <div className="absolute top-2 right-2">
                  <Circle className="w-2 h-2 text-green-400 fill-current" />
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{champion.name}</h3>
                  <p className="text-xs text-gray-400 mb-1 truncate">{champion.organization}</p>
                  <p className="text-xs text-gray-500 truncate">{champion.role}</p>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between">
                  <div
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${colors.neon}20`,
                      color: colors.neon,
                    }}
                  >
                    {champion.grade}
                  </div>
                  <MoreHorizontal className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="h-full bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/40 overflow-hidden">
            <div className="p-2 h-full flex flex-col">
              <h3 className="text-xs font-bold text-white mb-2 text-center truncate">{champion.name}</h3>

              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="text-[10px] font-semibold text-gray-400 mb-1">한마디</h4>
                  <p className="text-[10px] text-gray-300 italic leading-tight line-clamp-3">"{champion.message}"</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-semibold text-gray-400 mb-1">전문분야</h4>
                  <div className="flex flex-wrap gap-1">
                    {champion.specialties.slice(0, 2).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-1 py-0.5 rounded text-[9px] leading-none"
                        style={{
                          backgroundColor: `${colors.neon}15`,
                          color: colors.neon,
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                    {champion.specialties.length > 2 && (
                      <span className="text-[9px] text-gray-500">+{champion.specialties.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-1">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    backgroundColor: `${colors.neon}20`,
                    color: colors.neon,
                  }}
                >
                  {champion.grade}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
