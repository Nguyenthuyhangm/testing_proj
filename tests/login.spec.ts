import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000/api/login";

test.describe("Login API Tests", () => {

  // 1. Login thành công → 200
  test("Valid credentials → 200", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "demo_user@example.com", // DÙNG FAKE, không phải thật
        password: "DemoPass123!"               // DÙNG FAKE
      }
    });
    expect(response.status()).toBe(200);
  });

  // 2. Sai mật khẩu → 401
  test("Invalid password → 401", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "tungti30520017@gmail.com",
        password: "wrongpassword"
      }
    });
    expect(response.status()).toBe(401);
  });

  // 3. Thiếu password → 401
  test("Missing password → 401", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "tungti30520017@gmail.com",
        password: ""
      }
    });
    expect(response.status()).toBe(401);
  });

  // 4. Thiếu username → 401
  test("Missing username → 401", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "",
        password: "DemoPass123!"
      }
    });
    expect(response.status()).toBe(401);
  });

  // 5. Password < 6 ký tự → 401
  test("Password too short → 401", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "tungti30520017@gmail.com",
        password: "123"
      }
    });
    expect(response.status()).toBe(401);
  });

});
