-- Supabase Storage에 프로필 이미지용 버킷 생성
INSERT INTO storage.buckets (id, name, public) 
VALUES ('champion-profiles', 'champion-profiles', true);

-- 버킷 정책 설정 (공개 읽기 허용)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'champion-profiles');

-- 관리자만 업로드 가능하도록 설정
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'champion-profiles');
