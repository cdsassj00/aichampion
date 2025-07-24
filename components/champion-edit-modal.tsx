"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Upload, User } from "lucide-react"
import type { Champion, ChampionGrade } from "@/lib/types"
import { uploadImage } from "@/lib/supabase"

interface ChampionEditModalProps {
  champion: Champion | null
  isOpen: boolean
  onClose: () => void
  onSave: (championData: Partial<Champion>) => Promise<void>
  isNew: boolean
}

export function ChampionEditModal({ champion, isOpen, onClose, onSave, isNew }: ChampionEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    role: "",
    grade: "그린" as ChampionGrade,
    specialties: [] as string[],
    message: "",
    profileImage: "",
  })
  const [specialtyInput, setSpecialtyInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (champion && !isNew) {
      setFormData({
        name: champion.name,
        organization: champion.organization,
        role: champion.role,
        grade: champion.grade,
        specialties: [...champion.specialties],
        message: champion.message,
        profileImage: champion.profileImage || "",
      })
      setImagePreview(champion.profileImage || "")
    } else {
      setFormData({
        name: "",
        organization: "",
        role: "",
        grade: "그린",
        specialties: [],
        message: "",
        profileImage: "",
      })
      setImagePreview("")
    }
    setSpecialtyInput("")
    setImageFile(null)
  }, [champion, isNew, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()],
      }))
      setSpecialtyInput("")
    }
  }

  const handleRemoveSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let profileImageUrl = formData.profileImage

      // 새 이미지가 업로드된 경우
      if (imageFile) {
        console.log("새 이미지 업로드 시작:", imageFile.name)
        const fileName = `${Date.now()}-${formData.name.replace(/\s+/g, "-").toLowerCase()}.${imageFile.name.split(".").pop()}`
        profileImageUrl = await uploadImage(imageFile, fileName)
        console.log("이미지 업로드 완료:", profileImageUrl)
      }

      await onSave({
        ...formData,
        profileImage: profileImageUrl || null,
      })

      onClose()
    } catch (error) {
      console.error("저장 실패:", error)
      alert("저장에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{isNew ? "새 챔피언 추가" : "챔피언 정보 수정"}</h2>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">프로필 이미지</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.error("미리보기 이미지 로딩 실패:", imagePreview)
                      }}
                    />
                  ) : (
                    <User className="w-8 h-8 text-white/40" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    이미지 선택
                  </label>
                  <p className="text-xs text-white/60 mt-1">JPG, PNG 파일만 지원됩니다.</p>
                </div>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">등급 *</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="거점리더">거점리더</option>
                  <option value="블랙">블랙</option>
                  <option value="블루">블루</option>
                  <option value="그린">그린</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">소속 기관 *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">직책 *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 전문분야 */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">전문분야</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialty())}
                  placeholder="전문분야 입력 후 추가 버튼 클릭"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialty}
                  className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(index)}
                      className="ml-2 text-blue-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 메시지 */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">한마디 메시지 *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="챔피언으로서의 다짐이나 메시지를 입력해주세요"
              />
            </div>

            {/* 버튼 */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                {loading ? "저장 중..." : isNew ? "추가" : "수정"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
