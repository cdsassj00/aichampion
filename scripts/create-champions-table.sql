-- 챔피언 테이블 생성
CREATE TABLE IF NOT EXISTS champions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  role VARCHAR(150) NOT NULL,
  grade VARCHAR(20) NOT NULL CHECK (grade IN ('거점리더', '블랙', '블루', '그린')),
  message TEXT NOT NULL,
  specialties TEXT[] NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_champions_updated_at 
    BEFORE UPDATE ON champions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_champions_grade ON champions(grade);
CREATE INDEX IF NOT EXISTS idx_champions_name ON champions(name);
CREATE INDEX IF NOT EXISTS idx_champions_organization ON champions(organization);
