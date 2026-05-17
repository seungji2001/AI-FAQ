import { test, expect } from "@playwright/test";

test.describe("메인 피드 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ko");
    await page.waitForLoadState("networkidle");
  });

  test("페이지가 정상 로딩된다", async ({ page }) => {
    await expect(page).toHaveURL(/\/ko/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("헤더에 THINGZ 로고가 표시된다", async ({ page }) => {
    await expect(page.getByText("THINGZ").first()).toBeVisible();
  });

  test("오늘의 에디터 섹션이 표시된다", async ({ page }) => {
    await expect(page.getByText("오늘의 에디터").first()).toBeVisible();
  });

  test("최근 아티클 섹션 또는 빈 상태 메시지가 표시된다", async ({ page }) => {
    const hasRecent = await page.getByText("최근 아티클").isVisible().catch(() => false);
    const hasEmpty = await page.getByText("아직 아티클이 없습니다").isVisible().catch(() => false);
    expect(hasRecent || hasEmpty).toBe(true);
  });

  test("헤더에 로그인 버튼이 표시된다 (비로그인)", async ({ page }) => {
    await expect(page.getByRole("button", { name: "로그인" }).first()).toBeVisible();
  });

  test("헤더에 글쓰기(발행) 버튼이 표시된다", async ({ page }) => {
    // t.nav.write = "발행" (ko 번역)
    await expect(page.getByRole("button", { name: /발행|등록|write/i }).first()).toBeVisible();
  });

  test("아티클 카드 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
    const articleLink = page.locator("a[href*='/article/']").first();
    const hasArticle = await articleLink.isVisible().catch(() => false);
    if (!hasArticle) { test.skip(); return; }
    await articleLink.click();
    await expect(page).toHaveURL(/\/article\/.+/);
  });
});
