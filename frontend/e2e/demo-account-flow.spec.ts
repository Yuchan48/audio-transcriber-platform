import {
  expect,
  test,
  type Page,
  type APIRequestContext,
} from "@playwright/test";

import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

const DEMO_EMAIL = process.env.VITE_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.VITE_DEMO_PASSWORD;

async function ensureDemoUser(request: APIRequestContext) {
  const loginResponse = await request.post("http://localhost/api/auth/login", {
    data: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    headers: { "Content-Type": "application/json" },
    failOnStatusCode: false,
  });

  if (loginResponse.status() === 200) {
    return;
  }

  if (loginResponse.status() !== 401) {
    throw new Error(
      `Demo account setup failed with status ${loginResponse.status()}: ${await loginResponse.text()}`,
    );
  }

  const registerResponse = await request.post(
    "http://localhost/api/auth/register",
    {
      data: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      headers: { "Content-Type": "application/json" },
      failOnStatusCode: false,
    },
  );

  if (
    registerResponse.status() !== 200 &&
    registerResponse.status() !== 400 &&
    registerResponse.status() !== 409
  ) {
    throw new Error(
      `Demo account setup failed with status ${registerResponse.status()}: ${await registerResponse.text()}`,
    );
  }
}

async function loginWithDemoAccount(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Use Demo Account" }).click();
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL(/\/dashboard$/);
  await expect(
    page.getByRole("main").getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
}

async function uploadTestAudio(page: Page, fileName: string) {
  await page.setInputFiles("#file-upload", {
    name: fileName,
    mimeType: "audio/wav",
    buffer: Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00]),
  });

  await expect(
    page
      .locator("p.text-sm.text-gray-800")
      .filter({ hasText: new RegExp(`${fileName.replace(/\./g, "\\.")}$`) }),
  ).toBeVisible();
}

test.describe("demo account flows", () => {
  test.beforeEach(async ({ request }) => {
    await ensureDemoUser(request);
  });

  test("auth: demo account login reaches the dashboard", async ({ page }) => {
    await loginWithDemoAccount(page);

    await expect(
      page.getByText(
        /You are using a demo account\. All uploaded audio will be deleted when you log out\./i,
      ),
    ).toBeVisible();
  });

  test("upload: a user can upload an audio file and it appears in the dashboard", async ({
    page,
  }) => {
    await loginWithDemoAccount(page);

    await uploadTestAudio(page, "playwright-upload.wav");
  });

  test("delete: a user can delete an uploaded audio file and it is removed from the dashboard", async ({
    page,
  }) => {
    await loginWithDemoAccount(page);

    await uploadTestAudio(page, "playwright-delete.wav");

    const fileRow = page
      .locator("div")
      .filter({
        has: page.locator("p.text-sm.text-gray-800").filter({
          hasText: /playwright-delete\.wav$/,
        }),
      })
      .first();

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await fileRow.getByRole("button", { name: "Delete" }).click();

    await expect(
      page.locator("p.text-sm.text-gray-800").filter({
        hasText: /playwright-delete\.wav$/,
      }),
    ).toHaveCount(0);
  });
});

test.describe("auth and validation flows", () => {
  test("auth protection: unauthenticated access redirects to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await page.waitForURL(/\/login$/);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("invalid login: shows an error and keeps the user on login", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("invalid@example.com");
    await page.locator("#password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Login failed")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});
