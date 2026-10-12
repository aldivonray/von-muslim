import { expect, test } from "@playwright/test";

test("the Pengenalan Islam page renders its static content", async ({
  page,
}) => {
  await page.goto("/pengenalan");
  await expect(
    page.getByRole("heading", { name: "Pengenalan Islam", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Rukun Islam").first()).toBeVisible();
});
