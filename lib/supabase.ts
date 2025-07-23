import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 프로필 이미지 업로드 함수
export async function uploadProfileImage(file: File, fileName: string) {
  try {
    const { data, error } = await supabase.storage.from("champion-profiles").upload(`profiles/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      throw error
    }

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("champion-profiles").getPublicUrl(`profiles/${fileName}`)

    return publicUrl
  } catch (error) {
    console.error("이미지 업로드 오류:", error)
    throw error
  }
}

// blob URL에서 이미지를 다운로드하고 Supabase Storage에 업로드
export async function migrateImageFromBlob(blobUrl: string, fileName: string) {
  try {
    // blob URL에서 이미지 다운로드
    const response = await fetch(blobUrl)
    const blob = await response.blob()

    // File 객체로 변환
    const file = new File([blob], fileName, { type: blob.type })

    // Supabase Storage에 업로드
    return await uploadProfileImage(file, fileName)
  } catch (error) {
    console.error("이미지 마이그레이션 오류:", error)
    throw error
  }
}

// Storage 버킷 생성 (관리자용)
export async function createStorageBucket() {
  try {
    const { data, error } = await supabase.storage.createBucket("champion-profiles", {
      public: true,
    })

    if (error && !error.message.includes("already exists")) {
      throw error
    }

    return data
  } catch (error) {
    console.error("버킷 생성 오류:", error)
    throw error
  }
}
