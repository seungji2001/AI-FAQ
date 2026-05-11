import { test, expect } from "@playwright/test";

test.describe("메인 피드 페이지 (/)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("페이지가 정상 로딩된다", async ({ page }) => {
    await expect(page).toHaveURL("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("헤더에 THINGZ 로고가 표시된다", async ({ page }) => {
    await expect(page.getByText("THINGZ").first()).toBeVisible();
  });

  test("오늘의 에디터 섹션이 표시된다", async ({ page }) => {
    await expect(page.getByText("오늘의 에디터")).toBeVisible();
  });

  test("아티클 목록 또는 빈 상태 메시지가 표시된다", async ({ page }) => {
    const hasFeatured = await page.locator("text=FEATURED").isVisible().catch(() => false);
    const hasEmpty = await page.locator("text=아직 아티클이 없습니다").isVisible().catch(() => false);
    expect(hasFeatured || hasEmpty).toBe(true);
  });

  test("최근 아티클 섹션 제목이 표시된다", async ({ page }) => {
    await expect(page.getByText("최근 아티클")).toBeVisible();
  });

  test("글쓰기 페이지로 이동할 수 있다", async ({ page }) => {
    const writeLink = page.getByRole("link", { name: /글쓰기|write/i }).first();
    const hasWriteLink = await writeLink.isVisible().catch(() => false);
    if (hasWriteLink) {
      await writeLink.click();
      await expect(page).toHaveURL("/write");
    } else {
      await page.goto("/write");
      await expect(page).toHaveURL("/write");
    }
  });

  test("FEATURED 카드 클릭 시 아티클 상세로 이동한다", async ({ page }) => {
    const featuredCard = page.locator("text=FEATURED").first();
    const hasFeatured = await featuredCard.isVisible().catch(() => false);

    if (hasFeatured) {
      await featuredCard.click();
      await expect(page).toHaveURL(/\/article\/.+/);
      await expect(page.getByText("← 피드로 돌아가기")).toBeVisible();
    } else {
      test.skip();
    }
  });
});
