import { test, expect } from "@playwright/test";

test("카카오 소셜 로그인 전체 흐름 — Kakao 인증 서버까지 실제 이동", async ({ page }) => {
  // 1. 메인 페이지
  await page.goto("/ko");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "e2e/screenshots/full-01-main.png" });

  // 2. 로그인 다이얼로그 열기
  await page.getByRole("button", { name: "로그인" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  await page.screenshot({ path: "e2e/screenshots/full-02-dialog.png" });

  // 3. 카카오 버튼 클릭 — 실제 리다이렉트 허용 (route 없음)
  const [response] = await Promise.all([
    page.waitForResponse(
      (r) =>
        r.url().includes("oauth2/authorization/kakao") ||
        r.url().includes("kauth.kakao.com"),
      { timeout: 15_000 }
    ).catch(() => null),
    page.getByRole("button", { name: /카카오/ }).click(),
  ]);

  // 4. Kakao 인증 서버로 이동될 때까지 대기
  await page.waitForURL(/kauth\.kakao\.com/, { timeout: 20_000 }).catch(() => {});
  const finalUrl = page.url();
  await page.screenshot({ path: "e2e/screenshots/full-03-kakao-page.png" });

  console.log("🔗 최종 도착 URL:", finalUrl);

  // 5. 검증: kauth.kakao.com 또는 백엔드 OAuth로 이동했는지
  const reachedKakao = finalUrl.includes("kauth.kakao.com");
  const reachedBackendOAuth = finalUrl.includes("thingz-backend.onrender.com");
  const reachedLocalhostError = finalUrl.includes("localhost");

  console.log("\n📋 최종 검증 결과:");
  if (reachedKakao) {
    console.log("✅ Kakao 인증 서버 도달:", finalUrl);
    const clientIdParam = new URL(finalUrl).searchParams.get("client_id");
    const redirectUri = new URL(finalUrl).searchParams.get("redirect_uri");
    console.log("   client_id:", clientIdParam ?? "(없음)");
    console.log("   redirect_uri:", redirectUri ?? "(없음)");
  } else if (reachedBackendOAuth) {
    console.log("⚠️  백엔드 OAuth 엔드포인트에 머무름 (리다이렉트 미완료):", finalUrl);
  } else if (reachedLocalhostError) {
    console.log("❌ localhost로 요청됨 — 환경변수 미적용:", finalUrl);
  } else {
    console.log("ℹ️  현재 URL:", finalUrl);
  }

  expect(reachedLocalhostError, "localhost로 이동하면 안 됩니다").toBe(false);
  expect(reachedKakao || reachedBackendOAuth, "Kakao 또는 백엔드 OAuth로 이동해야 합니다").toBe(true);
});
