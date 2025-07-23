"use client"

import { useState } from "react"
import { Download, Check, AlertCircle } from "lucide-react"
import { migrateImageFromBlob, createStorageBucket } from "@/lib/supabase"
import { useChampions } from "@/lib/champion-context"

export function ImageMigration() {
  const { champions, loadSampleData } = useChampions()
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<Record<string, "pending" | "success" | "error">>({})
  const [isCreatingBucket, setIsCreatingBucket] = useState(false)

  const blobImages = [
    {
      name: "kim-jeong-su.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/kim-jeong-su-QtO7JlD6QoiPchnX8y38cvEDqVE3Wt.png",
    },
    {
      name: "park-min-young.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/park-min-young-9VgF3Vb7zoUsBbG1eRPT3tjouG95Ii.png",
    },
    {
      name: "lee-seung-ho.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/lee-seung-ho-OMKeur2aR08ARl61PBoNZ8MiZZ1Mkq.png",
    },
    {
      name: "choi-hyun-woo.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/choi-hyun-woo-pXbfEhSv1SV0W6wWpMFpE48Y1X3rBe.png",
    },
    {
      name: "jung-su-yeon.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/jung-su-yeon-H0SxanByAJ1IEVFOYRZc8eDSHENcGL.png",
    },
    {
      name: "kang-tae-min.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/kang-tae-min-jmn6z8xkFhsonUMm3JqjdWUmGZ0BY7.png",
    },
    {
      name: "yoon-ji-hye.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/yoon-ji-hye-RPs0GDggJHwJPTvq6Y42oKMQG8vhCC.png",
    },
    {
      name: "kim-do-hyun.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/kim-do-hyun-ghg5HLTjvRkQIq45WPTHqoHxGlu1ez.png",
    },
    {
      name: "lee-so-young.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/lee-so-young-CfJ5KRvrEB0szZ2eZZP4kgPJl0Jj0L.png",
    },
    {
      name: "park-jun-hyuk.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/park-jun-hyuk-n3Kg4CCCgXH9xYsvpV9IirFha8pZWP.png",
    },
    {
      name: "jo-min-seo.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/jo-min-seo-81MyANjEDf2CipQ1B2h3n2ZHotn6N7.png",
    },
    {
      name: "han-sang-min.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/han-sang-min-07JJPZ06C8v5qGhRp3bsyDfkZuM61Y.png",
    },
    {
      name: "shin-ye-rin.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/shin-ye-rin-Z7W4vyHkT9wYXaaDG743kPTZU2lSK0.png",
    },
    {
      name: "oh-tae-jun.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/oh-tae-jun-ATaAQJ6mGvNjUFiPEpTXMruxbID7wa.png",
    },
    {
      name: "kim-ha-eun.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/kim-ha-eun-xgLfq2BZdKDmHwBNLFj6YGgUNw7jcN.png",
    },
    {
      name: "jung-da-eun.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/jung-da-eun-h2jo9tTBiwzUkzQj2UKD4nCNwMxvOs.png",
    },
    {
      name: "choi-min-jae.png",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/profiles/choi-min-jae-OV7YPzcCm01WvQ5oy5vi9soE3VuuXR.png",
    },
  ]

  const handleCreateBucket = async () => {
    setIsCreatingBucket(true)
    try {
      await createStorageBucket()
      alert("Storage 버킷이 생성되었습니다!")
    } catch (error) {
      console.error("버킷 생성 실패:", error)
      alert("버킷 생성에 실패했습니다. 이미 존재하거나 권한이 없을 수 있습니다.")
    } finally {
      setIsCreatingBucket(false)
    }
  }

  const handleMigrateAll = async () => {
    setIsMigrating(true)
    setMigrationStatus({})

    for (const image of blobImages) {
      try {
        setMigrationStatus((prev) => ({ ...prev, [image.name]: "pending" }))

        const supabaseUrl = await migrateImageFromBlob(image.url, image.name)
        console.log(`✅ ${image.name} 마이그레이션 완료: ${supabaseUrl}`)

        setMigrationStatus((prev) => ({ ...prev, [image.name]: "success" }))

        // 잠시 대기 (API 제한 방지)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`❌ ${image.name} 마이그레이션 실패:`, error)
        setMigrationStatus((prev) => ({ ...prev, [image.name]: "error" }))
      }
    }

    setIsMigrating(false)
    alert("이미지 마이그레이션이 완료되었습니다! 샘플 데이터를 다시 로드해주세요.")
  }

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Download className="w-5 h-5 mr-2" />
        이미지 마이그레이션
      </h3>

      <div className="space-y-4">
        <p className="text-white/70 text-sm">현재 임시 blob URL의 이미지들을 Supabase Storage로 이전합니다.</p>

        {/* 버킷 생성 */}
        <div className="flex space-x-3">
          <button
            onClick={handleCreateBucket}
            disabled={isCreatingBucket}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30 disabled:opacity-50"
          >
            {isCreatingBucket ? "생성 중..." : "1. Storage 버킷 생성"}
          </button>
        </div>

        {/* 마이그레이션 실행 */}
        <div className="flex space-x-3">
          <button
            onClick={handleMigrateAll}
            disabled={isMigrating}
            className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all border border-purple-500/30 disabled:opacity-50"
          >
            {isMigrating ? "마이그레이션 중..." : "2. 모든 이미지 마이그레이션"}
          </button>
        </div>

        {/* 진행 상황 */}
        {Object.keys(migrationStatus).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white mb-2">진행 상황:</h4>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {blobImages.map((image) => {
                const status = migrationStatus[image.name]
                return (
                  <div key={image.name} className="flex items-center space-x-2 text-xs">
                    {status === "success" ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : status === "error" ? (
                      <AlertCircle className="w-3 h-3 text-red-400" />
                    ) : status === "pending" ? (
                      <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-600 rounded-full" />
                    )}
                    <span
                      className={
                        status === "success"
                          ? "text-green-400"
                          : status === "error"
                            ? "text-red-400"
                            : status === "pending"
                              ? "text-purple-400"
                              : "text-gray-400"
                      }
                    >
                      {image.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>⚠️ 마이그레이션 후 샘플 데이터를 다시 로드하여 새로운 URL을 적용하세요.</p>
        </div>
      </div>
    </div>
  )
}
