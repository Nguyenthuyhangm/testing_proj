import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5000/api";

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2NTQ0NzAwOCwiZXhwIjoxNzY2MDUxODA4fQ._UI2GY5_JKZkhWJ-CvdNmh6o5eUKi699ZQ-6zPj8fmw"; 
const USER_ID = 1;

test.describe("API - Order Creation", () => {


  test("TC1 - Thiếu thông tin giỏ hàng → 400", async ({ request }) => {
    const res = await request.post(`${BASE}/orders`, {
      headers: auth(TOKEN),
      data: {
        cartItems: [],
        deliveryAddress: {
          fullName: "Test",
          phone: "0123",
          street: "abc"
        }
      }
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).message).toBe("Thiếu thông tin giỏ hàng.");
  });


  test("TC2 - Thiếu thông tin địa chỉ → 400", async ({ request }) => {
    const res = await request.post(`${BASE}/orders`, {
      headers: auth(TOKEN),
      data: {
        cartItems: [{ foodId: 1, quantity: 1 }],
        deliveryAddress: null,
      }
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).message).toBe("Thiếu thông tin địa chỉ giao hàng.");
  });


  test("TC3 - Food không tồn tại → 400", async ({ request }) => {
    const res = await request.post(`${BASE}/orders`, {
      headers: auth(TOKEN),
      data: {
        cartItems: [{ foodId: 99999, quantity: 1 }],
        deliveryAddress: {
          fullName: "Test",
          phone: "0123",
          street: "abc"
        }
      }
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toContain("Không tìm thấy món ăn");
  });


  test("TC4 - totalAmount không khớp → 400", async ({ request }) => {
    const res = await request.post(`${BASE}/orders`, {
      headers: auth(TOKEN),
      data: {
        cartItems: [{ foodId: 1, quantity: 1 }],
        deliveryAddress: {
          fullName: "Test",
          phone: "0123",
          street: "abc"
        },
        totalAmount: 1
      }
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).message).toBe("Tổng tiền không khớp.");
  });

  
  test("TC5 Tạo đơn khi payment = vnpay nhưng BE set cash", async ({ request }) => {
    const res = await request.post(`${BASE}/orders`, {
      headers: auth(TOKEN),
      data: {
        cartItems: [{ foodId: 1, quantity: 1 }],
        deliveryAddress: {
          fullName: "Tester",
          phone: "0123456789",
          street: "123 abc",
          district: "xyz",
          province: "Hanoi"
        },
        shippingFee: 0,
        totalAmount: 50000,
        paymentMethod: "vnpay"
      }
    });

    const body = await res.json();
    expect(res.status()).toBe(201);

    // Đây là lỗi — paymentMethod luôn là cash
    expect(body.paymentMethod).not.toBe("cash"); 
  });

});
