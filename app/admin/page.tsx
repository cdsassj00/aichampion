"use client"

import type React from "react"
import { useState } from "react"
import { useChampions } from "@/lib/champion-context"
import type { Champion } from "@/lib/types"
import { Lock, Plus, Trash2, Users, ArrowLeft, RefreshCw, Edit, Database, Upload } from "lucide-react"
import Link from "next/link"
import { ChampionEditModal } from "@/components/champion-edit-modal"

export default function AdminPage() {
  const {
    champions,
    addChampion,
    editChampion,
    removeChampion,
    refreshChampions,
    loadSampleData,
    checkStorageFiles,
    isAuthenticated,
    authenticate,
    logout,
    loading,
  } = useChampions()

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(!isAuthenticated)
  const [editingChampion, setEditingChampion] = useState<Champion | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewChampion, setIsNewChampion] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (authenticate(password)) {
      setShowPassword(false)
      setPassword("")
    } else {
      alert("비밀번호가 올바르지 않습니다.")
    }
  }

  const handleAddChampion = () => {
    setEditingChampion(null)
    setIsNewChampion(true)
    setIsModalOpen(true)
  }

  const handleEditChampion = (champion: Champion) => {
    setEditingChampion(champion)
    setIsNewChampion(false)
    setIsModalOpen(true)
  }

  const handleSaveChampion = async (championData: Partial<Champion>) => {
    try {
      if (isNewChampion) {
        await addChampion(championData as Omit<Champion, "id" | "createdAt">)
        alert("챔피언이 성공적으로 등록되었습니다!")
      } else if (editingChampion) {
        await editChampion(editingChampion.id, championData)
        alert("챔피언 정보가 성공적으로 수정되었습니다!")
      }
    } catch (error) {
      console.error("저장 실패:", error)
      throw error
    }
  }

  const handleDeleteChampion = async (champion: Champion) => {
    if (confirm(`${champion.name} 챔피언을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await removeChampion(champion.id)
        alert("챔피언이 삭제되었습니다.")
      } catch (error) {
        console.error("삭제 실패:", error)
        alert("삭제에 실패했습니다.")
      }
    }
  }

  const handleRefreshData = async () => {
    try {
      await refreshChampions()
      alert("데이터가 새로고침되었습니다!")
    } catch (error) {
      console.error("새로고침 실패:", error)
      alert("데이터 새로고침에 실패했습니다.")
    }
  }

  const handleLoadSampleData = async () => {
    if (confirm("샘플 데이터를 로드하시겠습니까? 기존 데이터와 중복되지 않는 데이터만 추가됩니다.")) {
      try {
        const result = await loadSampleData()
        alert(result.message)
      } catch (error) {
        console.error("샘플 데이터 로드 실패:", error)
        alert("샘플 데이터 로드에 실패했습니다.")
      }
    }
  }

  const handleCheckStorage = async () => {
    try {
      await checkStorageFiles()
      alert("Storage 파일 목록을 콘솔에서 확인하세요.")
    } catch (error) {
      console.error("Storage 확인 실패:", error)
      alert("Storage 확인에 실패했습니다.")
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
                {loading && (
                  <div className="ml-4 flex items-center text-white/60">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/60 mr-2"></div>
                    로딩 중...
                  </div>
                )}
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
          {/* 관리 도구 */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">관리 도구</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={handleRefreshData}
                className="px-4 py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                데이터 새로고침
              </button>
              <button
                onClick={handleLoadSampleData}
                className="px-4 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center"
                disabled={loading}
              >
                <Upload className="w-4 h-4 mr-2" />
                샘플 데이터 로드
              </button>
              <button
                onClick={handleCheckStorage}
                className="px-4 py-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center"
              >
                <Database className="w-4 h-4 mr-2" />
                Storage 확인
              </button>
              <button
                onClick={handleAddChampion}
                className="px-4 py-3 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />새 챔피언 추가
              </button>
            </div>
          </div>

          {/* 챔피언 목록 */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">챔피언 목록 ({champions.length}명)</h2>
            </div>

            {champions.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">등록된 챔피언이 없습니다.</p>
                <p className="text-white/40 text-sm mt-2">샘플 데이터를 로드하거나 새 챔피언을 추가해보세요.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {champions.map((champion) => (
                  <div
                    key={champion.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* 프로필 이미지 */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                        {champion.profileImage ? (
                          <img
                            src={champion.profileImage || "/placeholder.svg"}
                            alt={champion.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(
                                `관리자 페이지 이미지 로딩 실패: ${champion.name} - ${champion.profileImage}`,
                              )
                              e.currentTarget.style.display = "none"
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white/40"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg></div>`
                              }
                            }}
                            onLoad={() => {
                              console.log(`관리자 페이지 이미지 로딩 성공: ${champion.name}`)
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/40">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* 챔피언 정보 */}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{champion.name}</h3>
                        <p className="text-white/70 text-sm">
                          {champion.organization} • {champion.role}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              champion.grade === "거점리더"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : champion.grade === "블랙"
                                  ? "bg-gray-800/50 text-gray-300"
                                  : champion.grade === "블루"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {champion.grade}
                          </span>
                          <span className="text-xs text-white/50">
                            전문분야: {champion.specialties.join(", ") || "없음"}
                          </span>
                        </div>
                        {champion.profileImage && (
                          <p className="text-xs text-white/30 mt-1 truncate">이미지: {champion.profileImage}</p>
                        )}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditChampion(champion)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteChampion(champion)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 현재 데이터 현황 */}
            <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">현재 데이터 현황</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-300">
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

              <div className="mt-4 text-center">
                <p className="text-sm text-white/60">
                  프로필 이미지: {champions.filter((c) => c.profileImage).length}명 / 실루엣 아바타:{" "}
                  {champions.filter((c) => !c.profileImage).length}명
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 편집 모달 */}
      <ChampionEditModal
        champion={editingChampion}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveChampion}
        isNew={isNewChampion}
      />
    </div>
  )
}
