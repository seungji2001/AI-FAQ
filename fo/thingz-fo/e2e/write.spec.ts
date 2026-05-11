import { test, expect } from "@playwright/test";

test.describe("글쓰기 페이지 (/write)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/write");
  });

  test("페이지가 정상 로딩된다", async ({ page }) => {
    await expect(page).toHaveURL("/write");
  });

  test("헤더에 THINGZ 로고가 표시된다", async ({ page }) => {
    await expect(page.getByText("THINGZ").first()).toBeVisible();
  });

  test("임시저장 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByText("임시저장")).toBeVisible();
  });

  test("발행하기 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByRole("button", { name: "발행하기" })).toBeVisible();
  });

  test("제목 입력 필드에 텍스트를 입력할 수 있다", async ({ page }) => {
    const titleInput = page.getByPlaceholder("이 물건과의 이야기를 제목으로...");
    await titleInput.fill("테스트 제목입니다");
    await expect(titleInput).toHaveValue("테스트 제목입니다");
  });

  test("본문 입력 필드에 텍스트를 입력할 수 있다", async ({ page }) => {
    const contentInput = page.getByPlaceholder(/어떤 물건인가요/);
    await contentInput.fill("테스트 본문입니다. 여기에 내용을 작성합니다.");
    await expect(contentInput).toHaveValue("테스트 본문입니다. 여기에 내용을 작성합니다.");
  });

  test("태그를 Enter 키로 추가할 수 있다", async ({ page }) => {
    const tagInput = page.getByPlaceholder("+ 태그");
    await tagInput.fill("빈티지");
    await tagInput.press("Enter");
    await expect(page.getByText("#빈티지")).toBeVisible();
  });

  test("추가한 태그를 삭제할 수 있다", async ({ page }) => {
    const tagInput = page.getByPlaceholder("+ 태그");
    await tagInput.fill("삭제테스트");
    await tagInput.press("Enter");
    await expect(page.getByText("#삭제테스트")).toBeVisible();

    await page.locator("[data-testid='CancelIcon']").first().click();
    await expect(page.getByText("#삭제테스트")).not.toBeVisible();
  });

  test("제목 없이 임시저장 시 알림이 표시된다", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("제목");
      await dialog.dismiss();
    });
    await page.getByText("임시저장").click();
  });

  test("제목 없이 발행하기 시 알림이 표시된다", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("제목");
      await dialog.dismiss();
    });
    await page.getByRole("button", { name: "발행하기" }).click();
  });

  test("제목만 있고 본문 없이 발행하기 시 알림이 표시된다", async ({ page }) => {
    await page.getByPlaceholder("이 물건과의 이야기를 제목으로...").fill("테스트 제목");

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("본문");
      await dialog.dismiss();
    });
    await page.getByRole("button", { name: "발행하기" }).click();
  });

  test("제목과 본문 입력 후 발행 시 아티클 상세로 이동한다", async ({ page }) => {
    await page.getByPlaceholder("이 물건과의 이야기를 제목으로...").fill("E2E 테스트 아티클");
    await page.getByPlaceholder(/어떤 물건인가요/).fill("E2E 테스트를 위한 본문입니다.");

    await page.getByRole("button", { name: "발행하기" }).click();
    await page.waitForURL(/\/article\/.+/, { timeout: 10_000 });
    await expect(page.getByText("← 피드로 돌아가기")).toBeVisible();
  });
});
