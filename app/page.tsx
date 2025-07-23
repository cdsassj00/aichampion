"use client"

import { useState, useMemo } from "react"
import { useChampions } from "@/lib/champion-context"
import { DashboardStats } from "@/components/dashboard-stats"
import { FilterButtons } from "@/components/filter-buttons"
import { SearchBar } from "@/components/search-bar"
import { ChampionCard } from "@/components/champion-card"
import type { ChampionGrade } from "@/lib/types"
import { Settings, Home, Users, BarChart3, Bell, Search } from "lucide-react"
import Link from "next/link"
import { TopWaveLines } from "@/components/top-wave-lines"

export default function HomePage() {
  const { champions } = useChampions()
  const [selectedGrade, setSelectedGrade] = useState<ChampionGrade | "ALL">("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      const matchesGrade = selectedGrade === "ALL" || champion.grade === selectedGrade
      const matchesSearch =
        searchTerm === "" ||
        champion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        champion.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesGrade && matchesSearch
    })
  }, [champions, selectedGrade, searchTerm])

  return (
    <div className="min-h-screen bg-gray-900 flex relative overflow-hidden">
      {/* Background with top wave pattern */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="top-wave-background">
          <div className="top-wave-lines"></div>
        </div>
        <div className="floating-top-waves">
          <TopWaveLines />
        </div>
      </div>

      {/* Sidebar */}
      <div className="relative z-20 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800/50 flex flex-col">
        {/* Top section */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="mb-6">
            <div className="w-full h-16 bg-white rounded-xl flex items-center justify-center px-3 py-2 shadow-lg">
              <img src="/mois-logo.png" alt="행정안전부 로고" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-xs">관</span>
            </div>
            <div>
              <p className="text-white text-sm">관리자</p>
              <p className="text-gray-500 text-xs">MOIS Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-sm"
            >
              <Home className="w-4 h-4" />
              <span>HOME</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors text-sm"
            >
              <Users className="w-4 h-4" />
              <span>TEAM</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>STATS</span>
            </a>
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>ADMIN</span>
            </Link>
          </nav>

          {/* Grade info section */}
          <div className="mt-8 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">등급 안내</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-gray-400">거점리더</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-gray-800 border border-gray-600 rounded-full"></div>
                <span className="text-gray-400">블랙</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">블루</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">그린</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-800/50">
          <div className="text-xs text-gray-500">
            <p>© 2024 MOIS</p>
            <p>AI Champion Hall</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        {/* Top navigation bar */}
        <header className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-800/30 px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-green-400">HOME</span>
              <span className="text-gray-400">TEAM</span>
              <span className="text-gray-400">STATS</span>
              <span className="text-gray-400">DASHBOARD</span>
              <span className="text-gray-400">SETTINGS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-4 h-4 text-gray-400" />
              <Search className="w-4 h-4 text-gray-400" />
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="p-8 pt-32">
          {/* Title section - moved down to avoid wave overlap */}
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-2">MOIS Research & Development</div>
            <h1 className="text-4xl font-bold text-white mb-2">행정안전부 AI챔피온 명예의 전당</h1>
            <p className="text-lg text-gray-400">Ministry of the Interior and Safety</p>
            <p className="text-sm text-gray-500 mt-1">MOIS AI Champion Hall of Fame</p>
          </div>

          <DashboardStats />

          <div className="mb-6 space-y-4">
            <FilterButtons selectedGrade={selectedGrade} onGradeChange={setSelectedGrade} />
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>

          {/* Champions Grid */}
          {filteredChampions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredChampions.map((champion) => (
                <ChampionCard key={champion.id} champion={champion} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-gray-700/30">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-600 flex items-center justify-center">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {champions.length === 0 ? "등록된 챔피언이 없습니다" : "검색 결과가 없습니다"}
                </h3>
                <p className="text-gray-400">
                  {champions.length === 0
                    ? "관리자 페이지에서 첫 번째 챔피언을 등록해보세요."
                    : "다른 검색어나 필터를 시도해보세요."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
