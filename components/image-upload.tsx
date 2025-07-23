"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Check, AlertCircle } from "lucide-react"
import { uploadProfileImage } from "@/lib/supabase"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  championName?: string
}

export function ImageUpload({ onImageUploaded, currentImage, championName }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      // 파일명 생성 (챔피언 이름 기반)
      const fileName = championName
        ? `${championName.replace(/\s+/g, "-").toLowerCase()}.${file.name.split(".").pop()}`
        : `profile-${Date.now()}.${file.name.split(".").pop()}`

      const imageUrl = await uploadProfileImage(file, fileName)
      onImageUploaded(imageUrl)
      setUploadStatus("success")

      // 3초 후 상태 초기화
      setTimeout(() => setUploadStatus("idle"), 3000)
    } catch (error) {
      console.error("업로드 실패:", error)
      setUploadStatus("error")
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      {/* 현재 이미지 미리보기 */}
      {currentImage && (
        <div className="flex items-center space-x-3">
          <img
            src={currentImage || "/placeholder.svg"}
            alt="현재 프로필"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="text-sm text-gray-400">현재 프로필 이미지</div>
        </div>
      )}

      {/* 드래그앤드롭 영역 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragActive ? "border-purple-500 bg-purple-500/10" : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-3">
          {uploadStatus === "success" ? (
            <Check className="w-12 h-12 text-green-400 mx-auto" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          ) : (
            <Upload
              className={`w-12 h-12 mx-auto ${isUploading ? "animate-pulse text-purple-400" : "text-gray-400"}`}
            />
          )}

          <div>
            <p className="text-white font-medium">
              {isUploading
                ? "업로드 중..."
                : uploadStatus === "success"
                  ? "업로드 완료!"
                  : uploadStatus === "error"
                    ? "업로드 실패"
                    : "이미지를 드래그하거나 클릭하여 업로드"}
            </p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF (최대 5MB)</p>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
    </div>
  )
}
