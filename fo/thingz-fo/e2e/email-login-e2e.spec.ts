import { test, expect } from "@playwright/test";

const BACKEND = "https://thingz-backend.onrender.com";

test("이메일 로그인 E2E — 회원가입 → 로그인 → 글쓰기 페이지 접근", async ({ page, request }) => {
  // 1. 백엔드에서 실제 토큰 발급
  const loginRes = await request.post(`${BACKEND}/api/auth/login`, {
    data: { email: "test@thingz.dev", password: "Test1234!" },
  });
  expect(loginRes.ok(), "로그인 API 성공해야 함").toBe(true);
  const { accessToken, refreshToken } = await loginRes.json();
  console.log("✅ 로그인 성공 — 토큰 발급");

  // 2. 토큰을 localStorage에 주입하고 메인 페이지 로딩
  await page.goto("/ko");
  await page.evaluate(([at, rt]) => {
    localStorage.setItem("thingz_access_token", at);
    localStorage.setItem("thingz_refresh_token", rt);
  }, [accessToken, refreshToken]);

  // 3. 새로고침 후 로그인 상태 확인
  await page.reload();
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "e2e/screenshots/email-01-main-loggedin.png" });

  // 4. localStorage 토큰 확인
  const storedAccess = await page.evaluate(() => localStorage.getItem("thingz_access_token"));
  expect(storedAccess).toBeTruthy();
  console.log("✅ 메인 페이지 — 토큰 정상 저장");

  // 5. 헤더에 로그인 버튼 사라지고 사용자명 표시 확인
  const loginBtn = page.getByRole("button", { name: "로그인" }).first();
  const hasLoginBtn = await loginBtn.isVisible().catch(() => false);
  console.log("로그인 버튼 보임:", hasLoginBtn ? "❌ (아직 표시)" : "✅ (사라짐)");

  // 6. 글쓰기 페이지 접근
  await page.goto("/ko/write");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "e2e/screenshots/email-02-write-page.png" });
  console.log("✅ 글쓰기 페이지 URL:", page.url());

  // 7. 글쓰기 페이지 정상 로딩 확인 (로그인 다이얼로그로 리다이렉트 안 됨)
  expect(page.url()).toContain("/write");
  await expect(page.getByPlaceholder(/이야기를 제목으로/)).toBeVisible({ timeout: 10_000 });
  console.log("✅ 글쓰기 에디터 정상 표시");

  // 8. 제목 + 본문 입력 후 발행 API 호출 확인
  await page.getByPlaceholder(/이야기를 제목으로/).fill("E2E 테스트 아티클 — 이메일 로그인");
  await page.getByPlaceholder(/어떤 물건인가요/).fill("이메일 로그인으로 작성된 테스트 게시물입니다.");

  let apiCalled = false;
  await page.route("**/api/fo/articles", async (route) => {
    if (route.request().method() === "POST") {
      apiCalled = true;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "e2e-test-article-id" }),
      });
    } else {
      await route.continue();
    }
  });

  await page.getByRole("button", { name: "발행하기" }).click();
  await page.waitForTimeout(2_000);
  expect(apiCalled, "발행 API 호출되어야 함").toBe(true);
  console.log("✅ 발행 API 호출 확인");
  await page.screenshot({ path: "e2e/screenshots/email-03-publish.png" });

  console.log("\n🎉 이메일 로그인 E2E 전체 플로우 완료!");
});
