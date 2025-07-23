// Node.js 스크립트로 모든 프로필 이미지를 Supabase Storage에 업로드
import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // 서비스 롤 키 필요
)

const profileImages = [
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
    name: "lee-jun-ho.png",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/placeholder-ObxMt4d3T5MDA2Ca7JyHf5lCNuxMZN.png",
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

async function uploadAllImages() {
  console.log("🚀 프로필 이미지 업로드 시작...")

  for (const image of profileImages) {
    try {
      // blob URL에서 이미지 다운로드
      const response = await fetch(image.url)
      const arrayBuffer = await response.arrayBuffer()
      const file = new Uint8Array(arrayBuffer)

      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage.from("champion-profiles").upload(`profiles/${image.name}`, file, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        console.error(`❌ ${image.name} 업로드 실패:`, error)
      } else {
        console.log(`✅ ${image.name} 업로드 성공`)
      }
    } catch (err) {
      console.error(`❌ ${image.name} 처리 중 오류:`, err)
    }
  }

  console.log("🎉 모든 이미지 업로드 완료!")
}

uploadAllImages()
