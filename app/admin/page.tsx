"use client"

import type React from "react"

import { useState } from "react"
import { useChampions } from "@/lib/champion-context"
import type { ChampionGrade } from "@/lib/types"
import { Lock, Plus, Trash2, Users, ArrowLeft, Download, Upload, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ImageMigration } from "@/components/image-migration"

export default function AdminPage() {
  const {
    champions,
    addChampion,
    removeChampion,
    loadSampleData,
    clearAllData,
    isAuthenticated,
    authenticate,
    logout,
  } = useChampions()
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState<"register" | "manage" | "data">("register")
  const [showPassword, setShowPassword] = useState(!isAuthenticated)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    role: "",
    grade: "그린" as ChampionGrade,
    message: "",
    specialties: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (authenticate(password)) {
      setShowPassword(false)
      setPassword("")
    } else {
      alert("비밀번호가 올바르지 않습니다.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.organization || !formData.role || !formData.message) {
      alert("모든 필수 항목을 입력해주세요.")
      return
    }

    addChampion({
      ...formData,
      specialties: formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    })

    setFormData({
      name: "",
      organization: "",
      role: "",
      grade: "그린",
      message: "",
      specialties: "",
    })

    alert("챔피언이 성공적으로 등록되었습니다!")
  }

  const handleLoadSampleData = () => {
    if (confirm("샘플 데이터를 로드하시겠습니까? 기존 데이터는 유지됩니다.")) {
      loadSampleData()
      alert("샘플 데이터가 로드되었습니다!")
    }
  }

  const handleClearAllData = () => {
    if (confirm("모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      clearAllData()
      alert("모든 데이터가 삭제되었습니다.")
    }
  }

  if (showPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-white/70 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">관리자 인증</h2>
            <p className="text-white/60">관리자 페이지에 접근하려면 비밀번호를 입력하세요.</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
            >
              로그인
            </button>
          </form>

          <Link href="/" className="block text-center text-white/60 hover:text-white mt-4 transition-colors">
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="mr-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white/70" />
                </Link>
                <h1 className="text-2xl font-bold text-white">관리자 페이지</h1>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-lg p-1 mb-8 max-w-lg">
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "register"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              챔피언 등록
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "manage"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              챔피언 관리
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "data"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              데이터 관리
            </button>
          </div>

          {/* Register Tab */}
          {activeTab === "register" && (
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">새 챔피언 등록</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">이름 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="챔피언 이름"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">소속 *</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="소속 기관"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">담당업무 *</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="담당 업무"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">등급</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value as ChampionGrade })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="그린">그린</option>
                      <option value="블루">블루</option>
                      <option value="블랙">블랙</option>
                      <option value="거점리더">거점리더</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">전문분야</label>
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="전문분야를 쉼표로 구분하여 입력 (예: AI, 머신러닝, 데이터분석)"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">한마디 메시지 *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="챔피언의 한마디 메시지"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  챔피언 등록
                </button>
              </form>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === "manage" && (
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">챔피언 관리 ({champions.length}명)</h2>

              {champions.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">등록된 챔피언이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {champions.map((champion) => (
                    <div
                      key={champion.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{champion.name}</h3>
                        <p className="text-white/70 text-sm">
                          {champion.organization} • {champion.role}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              champion.grade === "거점리더"
                                ? "bg-white/20 text-white"
                                : champion.grade === "블랙"
                                  ? "bg-gray-800/50 text-gray-300"
                                  : champion.grade === "블루"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {champion.grade}
                          </span>
                          <span className="text-xs text-white/50">전문분야: {champion.specialties.join(", ")}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`${champion.name} 챔피언을 삭제하시겠습니까?`)) {
                            removeChampion(champion.id)
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === "data" && (
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">데이터 관리</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <Upload className="w-6 h-6 text-green-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">샘플 데이터 로드</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    행정안전부 AI 챔피언 샘플 데이터를 로드합니다. 거점리더 3명, 블랙 4명, 블루 5명, 그린 6명의 데이터가
                    포함됩니다.
                  </p>
                  <button
                    onClick={handleLoadSampleData}
                    className="w-full bg-green-500/20 text-green-300 py-3 rounded-lg font-semibold hover:bg-green-500/30 transition-all border border-green-500/30"
                  >
                    샘플 데이터 로드
                  </button>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <RefreshCw className="w-6 h-6 text-red-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">전체 데이터 삭제</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4">
                    모든 챔피언 데이터를 삭제합니다. 이 작업은 되돌릴 수 없으니 신중하게 선택하세요.
                  </p>
                  <button
                    onClick={handleClearAllData}
                    className="w-full bg-red-500/20 text-red-300 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-all border border-red-500/30"
                  >
                    전체 데이터 삭제
                  </button>
                </div>
              </div>

              <ImageMigration />

              <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">현재 데이터 현황</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {champions.filter((c) => c.grade === "거점리더").length}
                    </p>
                    <p className="text-sm text-white/70">거점리더</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-300">
                      {champions.filter((c) => c.grade === "블랙").length}
                    </p>
                    <p className="text-sm text-white/70">블랙</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-300">
                      {champions.filter((c) => c.grade === "블루").length}
                    </p>
                    <p className="text-sm text-white/70">블루</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-300">
                      {champions.filter((c) => c.grade === "그린").length}
                    </p>
                    <p className="text-sm text-white/70">그린</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
