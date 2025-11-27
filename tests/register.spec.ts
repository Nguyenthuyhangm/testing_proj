import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000'; 

const generateUser = () => {
  const timestamp = Date.now();
  return {
    username: `user_${timestamp}`,
    email: `user_${timestamp}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!' 
  };
};

test.describe('API Registration Tests', () => {

  // 1. HAPPY PATH
  test('POST /register - Should register successfully with valid data', async ({ request }) => {
    const newUser = generateUser();
    const response = await request.post(`${BASE_URL}/register`, { data: newUser });
    expect(response.ok()).toBeTruthy();
  });

  // 2. DUPLICATE USERNAME
  test('POST /register - Should return 409 for existing username', async ({ request }) => {
    const user = generateUser();
    await request.post(`${BASE_URL}/register`, { data: user }); // Tạo lần 1

    const duplicateResponse = await request.post(`${BASE_URL}/register`, { data: user }); // Tạo lần 2
    expect(duplicateResponse.status()).toBe(409);
  });

  // 3. DUPLICATE EMAIL
  test('POST /register - Should return 409 for existing email', async ({ request }) => {
    const user1 = generateUser();
    await request.post(`${BASE_URL}/register`, { data: user1 });

    const user2 = {
      ...generateUser(),
      email: user1.email // Trùng email
    };

    const response = await request.post(`${BASE_URL}/register`, { data: user2 });
    expect(response.status()).toBe(409);
  });

  // 4. MISSING PASSWORD
  test('POST /register - Should fail if password is missing', async ({ request }) => {
    const invalidUser = {
      username: `nopass_${Date.now()}`,
      email: `nopass_${Date.now()}@test.com`
    };
    const response = await request.post(`${BASE_URL}/register`, { data: invalidUser });
    expect(response.status()).toBe(400);
  });

  // 5. INVALID EMAIL FORMAT (Mới thêm)
  test('POST /register - Should fail if email format is invalid', async ({ request }) => {
    const invalidEmailUser = {
      username: `format_err_${Date.now()}`,
      password: 'Password123!',
      confirmPassword: 'Password123!',
      
      // Test case: Email thiếu đuôi .com
      email: 'moi123@gmail' 
    };

    const response = await request.post(`${BASE_URL}/register`, { 
      data: invalidEmailUser 
    });

    // Mong đợi lỗi 400
    expect(response.status()).toBe(400);
  });

});