"use client"

import { useState, useEffect } from "react"
import { type Champion, gradeColors } from "@/lib/types"
import { User, Circle, MoreHorizontal, Crown, Award, Star, Sparkles } from "lucide-react"

interface ChampionCardProps {
  champion: Champion
}

const gradeIcons = {
  거점리더: Crown,
  블랙: Award,
  블루: Star,
  그린: Sparkles,
}

export function ChampionCard({ champion }: ChampionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [fallbackTried, setFallbackTried] = useState(false)
  const [imageSrc, setImageSrc] = useState(champion.profileImage || "")
  const colors = gradeColors[champion.grade]
  const IconComponent = gradeIcons[champion.grade] || User

  // 프로필 이미지가 있는지 확인 (null, undefined, 빈 문자열 모두 체크)
  const hasValidProfileImage = champion.profileImage && champion.profileImage.trim() !== ""

  const handleImageError = () => {
    console.log(`이미지 로딩 실패: ${champion.name} - ${imageSrc}`)
    if (!fallbackTried && imageSrc?.startsWith("http")) {
      // 첫 실패 → 로컬 /public 폴더 경로로 재시도
      const filename = imageSrc.split("/").pop() || ""
      setImageSrc(`/profiles/${filename}`)
      setFallbackTried(true)
      setImageLoaded(false)
      return
    }

    // 두 번째 실패 또는 첫 번째 실패 → 기본 아바타 표시
    setImageError(true)
    setImageLoaded(false)
  }

  const handleImageLoad = () => {
    console.log(`이미지 로딩 성공: ${champion.name} - ${imageSrc}`)
    setImageError(false)
    setImageLoaded(true)
  }

  useEffect(() => {
    console.log(`${champion.name} - profileImage:`, champion.profileImage)
    if (hasValidProfileImage) {
      setImageSrc(champion.profileImage!)
      setFallbackTried(false)
      setImageError(false)
      setImageLoaded(false)
    } else {
      // 이미지가 없는 경우
      console.log(`${champion.name} - 프로필 이미지 없음, 기본 아바타 사용`)
      setImageSrc("")
      setImageError(true) // 기본 아바타를 표시하기 위해 에러 상태로 설정
      setImageLoaded(false)
      setFallbackTried(false)
    }
  }, [champion.profileImage, champion.id, hasValidProfileImage])

  return (
    <div
      className="relative w-full h-32 cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front Side - 원래 horizontal layout */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div
            className="h-full bg-gray-800/60 backdrop-blur-sm rounded-lg border overflow-hidden relative transition-all duration-300 group-hover:shadow-lg"
            style={{
              borderColor: `${colors.neon}${isHovered ? "60" : "40"}`,
              boxShadow: `0 0 ${isHovered ? "15px" : "10px"} ${colors.neon}${isHovered ? "30" : "20"}`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex h-full">
              {/* Left side - Profile image */}
              <div className="w-24 h-full flex-shrink-0 relative">
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-l-lg relative bg-gray-700">
                  {/* 실제 프로필 이미지 - 이미지가 있고 성공적으로 로드된 경우만 표시 */}
                  {hasValidProfileImage && imageLoaded && !imageError && (
                    <img
                      src={imageSrc || "/placeholder.svg"}
                      alt={champion.name}
                      className="w-full h-full object-cover absolute inset-0 z-10"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  )}

                  {/* 이미지 로딩 시도 중인 경우 숨겨진 img 태그 */}
                  {hasValidProfileImage && !imageLoaded && !imageError && (
                    <img
                      src={imageSrc || "/placeholder.svg"}
                      alt={champion.name}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 pointer-events-none"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  )}

                  {/* 기본 아바타 이미지 - 이미지가 없거나 로딩 실패한 경우 항상 표시 */}
                  {(!hasValidProfileImage || imageError) && (
                    <img
                      src="/default-avatar.png"
                      alt={`${champion.name} 기본 아바타`}
                      className="w-full h-full object-cover absolute inset-0 z-10"
                      onError={(e) => {
                        console.error("기본 아바타 이미지도 로딩 실패")
                        // 기본 아바타도 실패하면 회색 배경 유지
                      }}
                    />
                  )}
                </div>

                {/* Online status indicator */}
                <div className="absolute top-2 right-2 z-30">
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
          <div
            className="h-full bg-gray-800/60 backdrop-blur-sm rounded-lg border overflow-hidden"
            style={{
              borderColor: `${colors.neon}40`,
              boxShadow: `0 0 10px ${colors.neon}20`,
            }}
          >
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
                    {champion.specialties?.slice(0, 2).map((specialty, index) => (
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
                    {champion.specialties && champion.specialties.length > 2 && (
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

export default ChampionCard
