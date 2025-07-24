import { createClient } from "@supabase/supabase-js"
import type { Champion } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ────────────────────────────────────────────────────────────
// NEW HELPERS FOR Storage bucket & image migration / upload
// ────────────────────────────────────────────────────────────

/**
 * Create the `champion-profiles` bucket if it doesn't exist.
 * Public read - true so that `getPublicUrl()` works.
 */
export async function createStorageBucket() {
  const { data, error } = await supabase.storage.createBucket("champion-profiles", {
    public: true,
  })

  // If the bucket already exists Supabase returns 400/409 → treat as success
  if (error && error.status !== 400 && error.status !== 409) {
    console.error("버킷 생성 오류:", error)
    throw error
  }

  // Return bucket info when newly created, or undefined on already-exists.
  return data
}

/**
 * Fetch an external (blob) image URL and upload it into the Storage bucket.
 * Returns the public URL of the newly uploaded file.
 *
 * @param blobUrl  Source HTTP(s) URL
 * @param fileName Destination file name (e.g. kim.png)
 */
export async function migrateImageFromBlob(blobUrl: string, fileName: string) {
  try {
    const res = await fetch(blobUrl)
    if (!res.ok) throw new Error(`원격 이미지 다운로드 실패: ${res.status}`)

    const arrayBuffer = await res.arrayBuffer()
    const filePath = `profiles/${fileName.replace(/^\/+/, "")}`

    const { error: uploadErr } = await supabase.storage.from("champion-profiles").upload(filePath, arrayBuffer, {
      contentType: res.headers.get("content-type") || "image/png",
      upsert: true,
    })

    if (uploadErr) {
      console.error("이미지 업로드 오류:", uploadErr)
      throw uploadErr
    }

    return getStorageUrl(filePath)
  } catch (err) {
    console.error("migrateImageFromBlob 실패:", err)
    throw err
  }
}

/**
 * Upload a File object coming from a browser (used by image-upload component).
 * @returns the public URL of the uploaded image
 */
export async function uploadProfileImage(file: File, fileName: string) {
  const path = `profiles/${fileName.replace(/^\/+/, "")}`
  const { error } = await supabase.storage.from("champion-profiles").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) {
    console.error("uploadProfileImage 오류:", error)
    throw error
  }

  return getStorageUrl(path)
}

// Storage에서 공개 URL 생성 (선행 슬래시 제거로 // 오류 방지)
export function getStorageUrl(fileName: string): string {
  if (!fileName) return ""

  // 1) 이미 전체 URL이면 그대로 반환
  if (fileName.startsWith("http")) return fileName

  // 2) fileName 앞쪽의 슬래시를 모두 제거해서 중복 "//" 방지
  const path = fileName.replace(/^\/+/, "") // '/profiles/kim.png' → 'profiles/kim.png'

  const { data } = supabase.storage.from("champion-profiles").getPublicUrl(path)

  return data.publicUrl
}

// 모든 챔피언 조회 (Storage URL 자동 생성) - 여기서 이준호 데이터를 가져옴
export async function getChampions(): Promise<Champion[]> {
  try {
    // 데이터베이스에서 champions 테이블 조회
    const { data, error } = await supabase.from("champions").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("챔피언 조회 오류:", error)
      throw error
    }

    // DB 데이터를 Champion 인터페이스에 맞게 변환하고 Storage URL 생성
    return (data || []).map((item) => {
      let profileImageUrl = null

      // profile_image_url이 있으면 Storage URL 생성 - 이준호의 이미지 링크가 여기서 처리됨
      if (item.profile_image_url) {
        // 이미 전체 URL인 경우와 파일명만 있는 경우 구분
        if (item.profile_image_url.startsWith("http")) {
          profileImageUrl = item.profile_image_url
        } else {
          profileImageUrl = getStorageUrl(item.profile_image_url)
        }
      }

      return {
        id: item.id,
        name: item.name,
        organization: item.organization,
        role: item.role,
        grade: item.grade,
        message: item.message,
        specialties: item.specialties || [],
        profileImage: profileImageUrl, // 이준호의 profileImage가 여기서 설정됨
        createdAt: item.created_at,
      }
    })
  } catch (error) {
    console.error("챔피언 조회 실패:", error)
    return []
  }
}

// 챔피언 생성
export async function createChampion(champion: Omit<Champion, "id" | "createdAt">) {
  try {
    const { data, error } = await supabase
      .from("champions")
      .insert({
        name: champion.name,
        organization: champion.organization,
        role: champion.role,
        grade: champion.grade,
        message: champion.message,
        specialties: champion.specialties,
        profile_image_url: champion.profileImage?.replace(/^\/+/, ""),
      })
      .select()
      .single()

    if (error) {
      console.error("챔피언 생성 오류:", error)
      throw error
    }

    // Storage URL 생성
    let profileImageUrl = null
    if (data.profile_image_url) {
      if (data.profile_image_url.startsWith("http")) {
        profileImageUrl = data.profile_image_url
      } else {
        profileImageUrl = getStorageUrl(data.profile_image_url)
      }
    }

    return {
      id: data.id,
      name: data.name,
      organization: data.organization,
      role: data.role,
      grade: data.grade,
      message: data.message,
      specialties: data.specialties || [],
      profileImage: profileImageUrl,
      createdAt: data.created_at,
    } as Champion
  } catch (error) {
    console.error("챔피언 생성 실패:", error)
    throw error
  }
}

// 챔피언 업데이트
export async function updateChampion(id: string, updates: Partial<Champion>) {
  try {
    const { data, error } = await supabase
      .from("champions")
      .update({
        name: updates.name,
        organization: updates.organization,
        role: updates.role,
        grade: updates.grade,
        message: updates.message,
        specialties: updates.specialties,
        profile_image_url: updates.profileImage?.replace(/^\/+/, ""),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("챔피언 업데이트 오류:", error)
      throw error
    }

    // Storage URL 생성
    let profileImageUrl = null
    if (data.profile_image_url) {
      if (data.profile_image_url.startsWith("http")) {
        profileImageUrl = data.profile_image_url
      } else {
        profileImageUrl = getStorageUrl(data.profile_image_url)
      }
    }

    return {
      id: data.id,
      name: data.name,
      organization: data.organization,
      role: data.role,
      grade: data.grade,
      message: data.message,
      specialties: data.specialties || [],
      profileImage: profileImageUrl,
      createdAt: data.created_at,
    } as Champion
  } catch (error) {
    console.error("챔피언 업데이트 실패:", error)
    throw error
  }
}

// 챔피언 삭제
export async function deleteChampion(id: string) {
  try {
    const { error } = await supabase.from("champions").delete().eq("id", id)

    if (error) {
      console.error("챔피언 삭제 오류:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("챔피언 삭제 실패:", error)
    throw error
  }
}

// 이미지 업로드
export async function uploadImage(file: File, fileName: string) {
  try {
    const { data, error } = await supabase.storage.from("champion-profiles").upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("이미지 업로드 오류:", error)
      throw error
    }

    // 업로드된 파일의 공개 URL 반환
    return getStorageUrl(fileName)
  } catch (error) {
    console.error("이미지 업로드 실패:", error)
    throw error
  }
}

// 이미지 삭제
export async function deleteImage(fileName: string) {
  try {
    const { error } = await supabase.storage.from("champion-profiles").remove([fileName])

    if (error) {
      console.error("이미지 삭제 오류:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("이미지 삭제 실패:", error)
    throw error
  }
}

// Storage 파일 목록 조회
export async function listStorageFiles() {
  try {
    const { data, error } = await supabase.storage.from("champion-profiles").list("", {
      limit: 100,
      offset: 0,
    })

    if (error) {
      console.error("Storage 파일 목록 조회 오류:", error)
      return []
    }

    console.log(
      "Storage 파일 목록:",
      data?.map((file) => file.name),
    )
    return data || []
  } catch (error) {
    console.error("Storage 파일 목록 조회 실패:", error)
    return []
  }
}

// URL에서 파일명 추출
export function getFileNameFromUrl(url: string): string {
  if (!url) return ""
  const parts = url.split("/")
  return parts[parts.length - 1]
}
