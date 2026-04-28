# THINGZ 개선 사항

## FeaturedCard
- 현재: `publishedAt DESC` 정렬 기준 첫 번째 아티클 (= 가장 최근 글)
- 개선안: `Article`에 `isFeatured boolean` 컬럼 추가 → 관리자(BO)가 지정
- 적용 시점: BO 관리자 기능 개발 시

## 인증
- 현재: `TEMP_USER_ID = "00000000-0000-0000-0000-000000000001"` 하드코딩
- 개선안: 로그인 세션/JWT 기반 유저 ID 주입
- 적용 시점: 로그인 기능 개발 시

## 이미지 업로드
- 현재: `imageUrls: []` 빈 배열 고정
- 개선안: S3 presigned URL 업로드 후 URL 배열 전달
- 적용 시점: S3 연동 개발 시
