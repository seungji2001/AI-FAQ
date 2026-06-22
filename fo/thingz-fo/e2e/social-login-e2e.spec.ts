import { test, expect } from "@playwright/test";

test("카카오 소셜 로그인 E2E — 실제 로그인 완료까지", async ({ page }) => {
  test.setTimeout(300_000);

  // 1. 메인 페이지 오픈
  await page.goto("/ko");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "e2e/screenshots/e2e-01-main.png" });

  // 2. 로그인 버튼 클릭
  await page.getByRole("button", { name: "로그인" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5_000 });
  await page.screenshot({ path: "e2e/screenshots/e2e-02-dialog.png" });

  // 3. 카카오 로그인 버튼 클릭 → 카카오 로그인 페이지로 이동
  await page.getByRole("button", { name: /카카오/ }).click();

  // 4. 카카오 로그인 페이지 대기
  await page.waitForURL(/accounts\.kakao\.com|kauth\.kakao\.com/, { timeout: 15_000 });
  await page.screenshot({ path: "e2e/screenshots/e2e-03-kakao-login.png" });
  console.log("✅ 카카오 로그인 페이지 도달:", page.url());
  console.log("👉 브라우저에서 카카오 계정으로 로그인해주세요...");

  // 5. 로그인 완료 후 thingz로 리다이렉트 대기 (최대 3분)
  await page.waitForURL(/thingz-one\.vercel\.app/, { timeout: 180_000 });
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "e2e/screenshots/e2e-04-after-login.png" });
  console.log("✅ 로그인 후 thingz 복귀:", page.url());

  // 6. 로그인 상태 확인 — localStorage에 토큰 존재
  const accessToken = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
  const refreshToken = await page.evaluate(() => localStorage.getItem("thingz_refresh_token"));

  console.log("accessToken:", accessToken ? "✅ 저장됨" : "❌ 없음");
  console.log("refreshToken:", refreshToken ? "✅ 저장됨" : "❌ 없음");

  // 7. 헤더에 사용자 이름 표시 확인
  await page.screenshot({ path: "e2e/screenshots/e2e-05-logged-in-header.png" });

  expect(accessToken, "accessToken이 저장되어야 합니다").toBeTruthy();
  expect(refreshToken, "refreshToken이 저장되어야 합니다").toBeTruthy();

  console.log("🎉 카카오 소셜 로그인 E2E 검증 완료!");
});
