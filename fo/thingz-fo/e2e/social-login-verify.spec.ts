import { test, expect } from "@playwright/test";

test("카카오 소셜 로그인 플로우 검증", async ({ page }) => {
  // 1. 메인 페이지 로딩
  await page.goto("/ko");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "e2e/screenshots/01-main.png", fullPage: false });
  console.log("✅ 1. 메인 페이지 로딩 완료:", page.url());

  // 2. 로그인 버튼 클릭
  await page.getByRole("button", { name: "로그인" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  await page.screenshot({ path: "e2e/screenshots/02-login-dialog.png" });
  console.log("✅ 2. 로그인 다이얼로그 표시");

  // 3. 카카오 로그인 버튼 표시 확인
  const kakaoBtn = page.getByRole("button", { name: /카카오/ });
  await expect(kakaoBtn).toBeVisible();
  console.log("✅ 3. 카카오 로그인 버튼 표시 확인");

  // 4. 카카오 클릭 후 리다이렉트 URL 확인
  let oauthUrl = "";
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("oauth2/authorization/kakao") || url.includes("kauth.kakao.com")) {
      oauthUrl = url;
      console.log("🔗 OAuth 요청 URL:", url);
      await route.abort(); // 실제 카카오 페이지 로딩 차단 (자격증명 불필요)
    } else {
      await route.continue();
    }
  });

  await kakaoBtn.click();
  await page.waitForTimeout(2_000);
  await page.screenshot({ path: "e2e/screenshots/03-after-kakao-click.png" });

  // 5. OAuth 엔드포인트 요청 확인
  console.log("\n📋 검증 결과:");
  if (oauthUrl) {
    console.log("✅ 카카오 OAuth 요청 확인:", oauthUrl);

    if (oauthUrl.includes("oauth2/authorization/kakao")) {
      console.log("   → 백엔드 OAuth 엔드포인트로 정상 요청");
    } else if (oauthUrl.includes("kauth.kakao.com")) {
      console.log("   → 카카오 인증 서버로 직접 리다이렉트");
    }
  } else {
    console.log("❌ 카카오 OAuth 요청이 감지되지 않음");
  }

  expect(oauthUrl).not.toBe("");
});

test("OAuth 콜백 처리 및 토큰 저장 검증", async ({ page }) => {
  // 실제 콜백 시뮬레이션
  await page.goto("/ko/auth/callback?accessToken=vercel-test-token&refreshToken=vercel-test-refresh");
  await page.waitForURL(/\/ko(\/)?$/, { timeout: 10_000 });
  await page.screenshot({ path: "e2e/screenshots/04-after-callback.png" });
  console.log("✅ OAuth 콜백 처리 후 리다이렉트:", page.url());

  const accessToken = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
  const refreshToken = await page.evaluate(() => localStorage.getItem("thingz_refresh_token"));

  console.log("✅ accessToken 저장:", accessToken ? "저장됨" : "❌ 없음");
  console.log("✅ refreshToken 저장:", refreshToken ? "저장됨" : "❌ 없음");

  expect(accessToken).toBe("vercel-test-token");
  expect(refreshToken).toBe("vercel-test-refresh");
});
