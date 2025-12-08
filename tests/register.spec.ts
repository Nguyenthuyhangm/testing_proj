import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5000/api/register";
function randomUser() {
  return "user_" + Math.floor(Math.random() * 100000);
}

test.describe("Register API Tests", () => {

  // TC1 – Thiếu thông tin => 400
  test("Missing fields → 400", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    });

    expect(response.status()).toBe(400);
  });

  // TC2 – Email sai định dạng nhưng vẫn đăng ký => 400
  test("Invalid email format → 400", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "user_invalid_email",
        email: "hello@gmail",  // sai format
        password: "Pass123!",
        confirmPassword: "Pass123!"
      }
    });

    expect(response.status()).toBe(400);
  });

  // TC3 – Mật khẩu xác nhận không khớp => 409
  test("Password confirm mismatch → 409", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "user_mismatch",
        email: "mismatch@example.com",
        password: "Pass123!",
        confirmPassword: "Pass1234!"
      }
    });

    expect(response.status()).toBe(409);
  });

  // TC4 – Username/email trùng => 409
  test("Username or email already exists → 409", async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        username: "existingUser",
        email: "existing@example.com",
        password: "Pass123!",
        confirmPassword: "Pass123!"
      }
    });

    expect(response.status()).toBe(409);
  });

  // TC5 – Đăng ký thành công → 200
  test("Successful registration → 200", async ({ request }) => {
  const user = randomUser();

  const response = await request.post(BASE_URL, {
    data: {
      username: user,
      email: `${user}@example.com`,
      password: "DemoPass123!",
      confirmPassword: "DemoPass123!"
    }
  });

  expect(response.status()).toBe(200);
});

});
