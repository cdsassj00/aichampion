"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Champion } from "./types"
import { getChampions, createChampion, updateChampion, deleteChampion } from "./supabase"
import { insertSampleData, listStorageFiles } from "./sample-data"

interface ChampionContextType {
  champions: Champion[]
  loading: boolean
  error: string | null
  addChampion: (champion: Omit<Champion, "id" | "createdAt">) => Promise<void>
  editChampion: (id: string, updates: Partial<Champion>) => Promise<void>
  removeChampion: (id: string) => Promise<void>
  refreshChampions: () => Promise<void>
  loadSampleData: () => Promise<{ success: boolean; message: string }>
  checkStorageFiles: () => Promise<void>
  isAuthenticated: boolean
  authenticate: (password: string) => boolean
  logout: () => void
}

const ChampionContext = createContext<ChampionContextType | undefined>(undefined)

export function ChampionProvider({ children }: { children: React.ReactNode }) {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 인증 상태 확인
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin-auth")
    setIsAuthenticated(authStatus === "true")
  }, [])

  // 챔피언 목록 새로고침
  const refreshChampions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("챔피언 데이터 로딩 시작...")

      const data = await getChampions()
      console.log(`${data.length}명의 챔피언 데이터 로드 완료`)

      // 이준호 님 데이터 특별 확인
      const junhoData = data.find((champion) => champion.name === "이준호")
      if (junhoData) {
        console.log("이준호 님 데이터:", {
          name: junhoData.name,
          profileImage: junhoData.profileImage,
          hasImage: !!junhoData.profileImage,
        })
      }

      // 이미지 URL 로그 출력
      data.forEach((champion) => {
        if (champion.profileImage) {
          console.log(`${champion.name}: ${champion.profileImage}`)
        } else {
          console.log(`${champion.name}: 프로필 이미지 없음 (실루엣 아바타 사용)`)
        }
      })

      setChampions(data)
    } catch (err) {
      setError("챔피언 목록을 불러오는데 실패했습니다.")
      console.error("챔피언 목록 조회 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  // 챔피언 추가
  const addChampion = async (championData: Omit<Champion, "id" | "createdAt">) => {
    try {
      const newChampion = await createChampion(championData)
      setChampions((prev) => [newChampion, ...prev])
      console.log(`새 챔피언 추가: ${newChampion.name}`)
    } catch (err) {
      setError("챔피언 추가에 실패했습니다.")
      console.error("챔피언 추가 오류:", err)
      throw err
    }
  }

  // 챔피언 수정
  const editChampion = async (id: string, updates: Partial<Champion>) => {
    try {
      const updatedChampion = await updateChampion(id, updates)
      setChampions((prev) => prev.map((champion) => (champion.id === id ? updatedChampion : champion)))
      console.log(`챔피언 수정: ${updatedChampion.name}`)
    } catch (err) {
      setError("챔피언 수정에 실패했습니다.")
      console.error("챔피언 수정 오류:", err)
      throw err
    }
  }

  // 챔피언 삭제
  const removeChampion = async (id: string) => {
    try {
      await deleteChampion(id)
      setChampions((prev) => prev.filter((champion) => champion.id !== id))
      console.log(`챔피언 삭제: ${id}`)
    } catch (err) {
      setError("챔피언 삭제에 실패했습니다.")
      console.error("챔피언 삭제 오류:", err)
      throw err
    }
  }

  // 샘플 데이터 로드
  const loadSampleData = async () => {
    try {
      setLoading(true)
      console.log("샘플 데이터 로드 시작...")

      const result = await insertSampleData()
      if (result.success) {
        await refreshChampions()
        console.log("샘플 데이터 로드 완료")
      }
      return result
    } catch (err) {
      console.error("샘플 데이터 로드 오류:", err)
      return { success: false, message: "샘플 데이터 로드 중 오류가 발생했습니다." }
    } finally {
      setLoading(false)
    }
  }

  // Storage 파일 확인
  const checkStorageFiles = async () => {
    try {
      console.log("Storage 파일 확인 시작...")
      const files = await listStorageFiles()
      console.log(
        "Storage 파일 목록:",
        files.map((file) => file.name),
      )
      console.log(`총 ${files.length}개의 파일이 Storage에 있습니다.`)
    } catch (err) {
      console.error("Storage 파일 확인 오류:", err)
    }
  }

  // 인증
  const authenticate = (password: string) => {
    if (password === "1234") {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-auth", "true")
      return true
    }
    return false
  }

  // 로그아웃
  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-auth")
  }

  // 초기 데이터 로드
  useEffect(() => {
    refreshChampions()
  }, [])

  const value: ChampionContextType = {
    champions,
    loading,
    error,
    addChampion,
    editChampion,
    removeChampion,
    refreshChampions,
    loadSampleData,
    checkStorageFiles,
    isAuthenticated,
    authenticate,
    logout,
  }

  return <ChampionContext.Provider value={value}>{children}</ChampionContext.Provider>
}

export function useChampions() {
  const context = useContext(ChampionContext)
  if (context === undefined) {
    throw new Error("useChampions must be used within a ChampionProvider")
  }
  return context
}
