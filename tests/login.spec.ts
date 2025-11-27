import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000/api/login";

test.describe("Login API Tests", () => {

  // 1. Login thành công → 200
  test("Valid credentials → 200", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "tungthoi",
        password: "yeumoi123"
      }
    });
    expect(response.status()).toBe(200);
  });

  // 2. Login thất bại → 401
  test("Invalid credentials → 401", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "tungthoi",
        password: "wrongpassword"
      }
    });
    expect(response.status()).toBe(401);
  });

});
