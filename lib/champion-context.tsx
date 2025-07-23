"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Champion } from "./types"
import { sampleChampions } from "./sample-data"

interface ChampionContextType {
  champions: Champion[]
  addChampion: (champion: Omit<Champion, "id">) => void
  removeChampion: (id: string) => void
  loadSampleData: () => void
  clearAllData: () => void
  isAuthenticated: boolean
  authenticate: (password: string) => boolean
  logout: () => void
}

const ChampionContext = createContext<ChampionContextType | undefined>(undefined)

export function ChampionProvider({ children }: { children: React.ReactNode }) {
  const [champions, setChampions] = useState<Champion[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("ai-champions")
    if (stored) {
      const existingChampions = JSON.parse(stored)
      // 기존 데이터가 placeholder 이미지를 사용하고 있다면 새 샘플 데이터로 교체
      const hasPlaceholderImages = existingChampions.some((champion: Champion) =>
        champion.profileImage?.includes("placeholder.svg"),
      )

      if (hasPlaceholderImages) {
        loadSampleData()
      } else {
        setChampions(existingChampions)
      }
    } else {
      // 처음 방문 시 샘플 데이터 자동 로드
      loadSampleData()
    }

    const authStatus = sessionStorage.getItem("admin-auth")
    setIsAuthenticated(authStatus === "true")
  }, [])

  const addChampion = (championData: Omit<Champion, "id">) => {
    const newChampion: Champion = {
      ...championData,
      id: Date.now().toString(),
    }
    const updated = [...champions, newChampion]
    setChampions(updated)
    localStorage.setItem("ai-champions", JSON.stringify(updated))
  }

  const removeChampion = (id: string) => {
    const updated = champions.filter((c) => c.id !== id)
    setChampions(updated)
    localStorage.setItem("ai-champions", JSON.stringify(updated))
  }

  const loadSampleData = () => {
    const championsWithIds: Champion[] = sampleChampions.map((champion, index) => ({
      ...champion,
      id: `sample-${index + 1}`,
    }))
    setChampions(championsWithIds)
    localStorage.setItem("ai-champions", JSON.stringify(championsWithIds))
  }

  const clearAllData = () => {
    setChampions([])
    localStorage.removeItem("ai-champions")
  }

  const authenticate = (password: string) => {
    if (password === "1234") {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-auth")
  }

  return (
    <ChampionContext.Provider
      value={{
        champions,
        addChampion,
        removeChampion,
        loadSampleData,
        clearAllData,
        isAuthenticated,
        authenticate,
        logout,
      }}
    >
      {children}
    </ChampionContext.Provider>
  )
}

export function useChampions() {
  const context = useContext(ChampionContext)
  if (!context) {
    throw new Error("useChampions must be used within ChampionProvider")
  }
  return context
}
