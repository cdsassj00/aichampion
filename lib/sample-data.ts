import type { Champion } from "./types"

// 샘플 챔피언 데이터 (프로필 이미지 파일명 포함)
export const sampleChampions: Omit<Champion, "id" | "createdAt">[] = [
  // 사진이 있는 챔피언들 (9명)
  {
    name: "김정수",
    organization: "과학기술정보통신부",
    role: "AI정책과장",
    grade: "거점리더",
    message: "AI 기술로 대한민국의 미래를 선도하겠습니다.",
    specialties: ["AI정책", "디지털전환", "기술혁신"],
    profileImage: "kim-jeong-su.png", // Storage 파일명
  },
  {
    name: "이준호",
    organization: "삼성전자",
    role: "AI연구소장",
    grade: "거점리더",
    message: "혁신적인 AI 기술로 세상을 바꾸겠습니다.",
    specialties: ["머신러닝", "딥러닝", "컴퓨터비전"],
    profileImage: "lee-jun-ho.png",
  },
  {
    name: "박민영",
    organization: "네이버",
    role: "AI플랫폼팀장",
    grade: "블랙",
    message: "사용자 중심의 AI 서비스를 만들어가겠습니다.",
    specialties: ["자연어처리", "추천시스템", "검색엔진"],
    profileImage: "park-min-young.png",
  },
  {
    name: "최현우",
    organization: "카카오",
    role: "AI Lab 연구원",
    grade: "블랙",
    message: "AI로 더 나은 소통의 세상을 만들겠습니다.",
    specialties: ["대화AI", "음성인식", "언어모델"],
    profileImage: "choi-hyun-woo.png",
  },
  {
    name: "정수연",
    organization: "LG전자",
    role: "AI제품기획자",
    grade: "블루",
    message: "생활 속 AI로 편리함을 선사하겠습니다.",
    specialties: ["IoT", "스마트홈", "제품기획"],
    profileImage: "jung-su-yeon.png",
  },
  {
    name: "강태민",
    organization: "현대자동차",
    role: "자율주행개발자",
    grade: "블루",
    message: "안전한 자율주행의 미래를 구현하겠습니다.",
    specialties: ["자율주행", "센서융합", "실시간처리"],
    profileImage: "kang-tae-min.png",
  },
  {
    name: "윤지혜",
    organization: "SK텔레콤",
    role: "AI서비스기획자",
    grade: "그린",
    message: "통신과 AI의 융합으로 새로운 가치를 창출하겠습니다.",
    specialties: ["5G", "엣지컴퓨팅", "서비스기획"],
    profileImage: "yoon-ji-hye.png",
  },
  {
    name: "한상민",
    organization: "NAVER AI Lab",
    role: "연구원",
    grade: "그린",
    message: "창의적인 AI 연구로 기술 발전에 기여하겠습니다.",
    specialties: ["강화학습", "로보틱스", "멀티모달"],
    profileImage: "han-sang-min.png",
  },
  {
    name: "오태준",
    organization: "삼성SDS",
    role: "AI솔루션 아키텍트",
    grade: "그린",
    message: "기업용 AI 솔루션으로 디지털 혁신을 이끌겠습니다.",
    specialties: ["엔터프라이즈AI", "클라우드", "데이터분석"],
    profileImage: "oh-tae-jun.png",
  },

  // 사진이 없는 챔피언들 (9명) - profileImage를 null로 설정
  {
    name: "김도현",
    organization: "한국전자통신연구원",
    role: "선임연구원",
    grade: "거점리더",
    message: "차세대 AI 기술 연구로 국가 경쟁력을 높이겠습니다.",
    specialties: ["양자컴퓨팅", "뉴로모픽", "차세대AI"],
    profileImage: null,
  },
  {
    name: "이승호",
    organization: "포스코ICT",
    role: "AI사업부장",
    grade: "거점리더",
    message: "제조업의 AI 혁신을 선도하겠습니다.",
    specialties: ["제조AI", "예측정비", "품질관리"],
    profileImage: null,
  },
  {
    name: "신예린",
    organization: "우아한형제들",
    role: "데이터사이언티스트",
    grade: "블랙",
    message: "데이터 기반 의사결정으로 비즈니스 가치를 창출하겠습니다.",
    specialties: ["데이터분석", "예측모델링", "A/B테스트"],
    profileImage: null,
  },
  {
    name: "박준혁",
    organization: "쿠팡",
    role: "ML엔지니어",
    grade: "블랙",
    message: "고객 경험 향상을 위한 AI 기술을 개발하겠습니다.",
    specialties: ["추천알고리즘", "물류최적화", "수요예측"],
    profileImage: null,
  },
  {
    name: "김하은",
    organization: "라인",
    role: "AI연구원",
    grade: "블루",
    message: "글로벌 AI 서비스로 세계와 소통하겠습니다.",
    specialties: ["다국어처리", "번역AI", "글로벌서비스"],
    profileImage: null,
  },
  {
    name: "이소영",
    organization: "넷마블",
    role: "게임AI개발자",
    grade: "블루",
    message: "게임과 AI의 만남으로 새로운 재미를 창조하겠습니다.",
    specialties: ["게임AI", "NPC행동", "절차적생성"],
    profileImage: null,
  },
  {
    name: "정다은",
    organization: "토스",
    role: "핀테크AI개발자",
    grade: "그린",
    message: "금융 서비스의 AI 혁신을 이끌어가겠습니다.",
    specialties: ["금융AI", "리스크관리", "사기탐지"],
    profileImage: null,
  },
  {
    name: "최민재",
    organization: "배달의민족",
    role: "추천시스템개발자",
    grade: "그린",
    message: "맛있는 경험을 위한 AI 기술을 개발하겠습니다.",
    specialties: ["추천시스템", "개인화", "사용자경험"],
    profileImage: null,
  },
  {
    name: "조민서",
    organization: "당근마켓",
    role: "커뮤니티AI개발자",
    grade: "그린",
    message: "따뜻한 커뮤니티를 위한 AI 기술을 만들겠습니다.",
    specialties: ["커뮤니티AI", "콘텐츠필터링", "사용자안전"],
    profileImage: null,
  },
]

// 샘플 데이터를 Supabase에 삽입하는 함수
export async function insertSampleData() {
  const { supabase } = await import("./supabase")

  try {
    // 기존 데이터 확인
    const { data: existingData } = await supabase.from("champions").select("name")
    const existingNames = existingData?.map((item) => item.name) || []

    // 중복되지 않는 데이터만 필터링
    const newChampions = sampleChampions.filter((champion) => !existingNames.includes(champion.name))

    if (newChampions.length === 0) {
      console.log("모든 샘플 데이터가 이미 존재합니다.")
      return { success: true, message: "모든 샘플 데이터가 이미 존재합니다." }
    }

    // 새로운 데이터 삽입
    const { error } = await supabase.from("champions").insert(
      newChampions.map((champion) => ({
        name: champion.name,
        organization: champion.organization,
        role: champion.role,
        grade: champion.grade,
        message: champion.message,
        specialties: champion.specialties,
        profile_image_url: champion.profileImage, // 파일명 또는 null
      })),
    )

    if (error) {
      console.error("샘플 데이터 삽입 오류:", error)
      throw error
    }

    console.log(`${newChampions.length}개의 새로운 샘플 데이터가 삽입되었습니다.`)
    return {
      success: true,
      message: `${newChampions.length}개의 새로운 샘플 데이터가 삽입되었습니다.`,
    }
  } catch (error) {
    console.error("샘플 데이터 삽입 실패:", error)
    return {
      success: false,
      message: "샘플 데이터 삽입에 실패했습니다.",
    }
  }
}

// Storage 파일 목록 조회
export async function listStorageFiles() {
  const { supabase } = await import("./supabase")

  try {
    const { data, error } = await supabase.storage.from("champion-profiles").list("", { limit: 100 })

    if (error) {
      console.error("Storage 파일 목록 조회 오류:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Storage 파일 목록 조회 실패:", error)
    return []
  }
}
