import { test } from "@playwright/test";

function createCirclePoints(
  x: number,
  y: number,
  radius: number,
  sides: number
) {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    points.push({ x: px, y: py });
  }
  return points;
}

test("profit", async ({ page }) => {
  await page.goto("https://neal.fun/perfect-circle/");

  await page.click("text=Go");
  await page.waitForTimeout(2000);

  const drawElement = await page.$("section > div");
  if (!drawElement) {
    throw new Error("element not found");
  }
  const box = await drawElement.boundingBox();
  if (!box) {
    throw new Error("box not found");
  }

  const points = createCirclePoints(
    // idk why this works
    box.x + box.height / 2,
    box.y + box.width / 2,
    box.width / 3,
    100
  );

  page.mouse.move(points[0].x, points[0].y);
  page.mouse.down();
  // Move twice to easily make a full circle
  for (const { x, y } of points) {
    await page.mouse.move(x, y);
  }
  for (const { x, y } of points) {
    await page.mouse.move(x, y);
  }
  page.mouse.up();

  // screenshot
  await page.screenshot({ path: "profit.png" });
});
