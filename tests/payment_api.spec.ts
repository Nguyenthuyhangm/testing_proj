import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5000/api";
const ORDER_ID = 10;  // cần đảm bảo DB có orderId này

test.describe("VNPay Payment API", () => {


  test("TC1 - INITIATE - Thiếu x-user-id → 401", async ({ request }) => {
    const res = await request.post(`${BASE}/orders/${ORDER_ID}/payments/initiate`, {
      data: { paymentMethod: "VNPAY" }
    });
    expect(res.status()).toBe(401);
  });

  test("TC2 - INITIATE - Không phải chủ đơn → 403", async ({ request }) => {
    const res = await request.post(`${BASE}/orders/${ORDER_ID}/payments/initiate`, {
      headers: { "x-user-id": "9999" },
      data: { paymentMethod: "VNPAY" }
    });
    expect(res.status()).toBe(403);
  });

  test("TC4 - INITIATE - Sai orderId → 404", async ({ request }) => {
    const res = await request.post(`${BASE}/orders/999999/payments/initiate`, {
      headers: { "x-user-id": "1" },
      data: { paymentMethod: "VNPAY" }
    });
    expect(res.status()).toBe(404);
  });

  test("TC5 - INITIATE - paymentMethod != VNPAY → 400", async ({ request }) => {
    const res = await request.post(`${BASE}/orders/${ORDER_ID}/payments/initiate`, {
      headers: { "x-user-id": "1" },
      data: { paymentMethod: "COD" }
    });
    expect(res.status()).toBe(400);
  });

  test("TC6 - INITIATE - Order paymentMethod = cash phải bị từ chối (dự kiến 400) → BUG", async ({ request }) => {
    const res = await request.post(`${BASE}/orders/${ORDER_ID}/payments/initiate`, {
      headers: { "x-user-id": "1" },
      data: { paymentMethod: "VNPAY" }
    });
    // Mong đợi 400 nhưng BE hiện trả 200 
    expect(res.status()).toBe(400);
  });

  test("TC7 - INITIATE - Success khi hợp lệ", async ({ request }) => {
    const res = await request.post(`${BASE}/orders/${ORDER_ID}/payments/initiate`, {
      headers: { "x-user-id": "1" },
      data: { paymentMethod: "VNPAY" }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.paymentUrl).toBeDefined();
    expect(body.paymentUrl).toContain("vnp_Amount");
  });



});

// Backend kiểm tra:

// checksum (vnp_SecureHash)

// amount có khớp không

// mã giao dịch có hợp lệ không

// mã kết quả (ResponseCode)

// Nếu hợp lệ → cập nhật status của đơn.

test.describe("VNPay Payment Return API", () => {
    test("TC1 - CALLBACK - Sai checksum → 400", async ({ request }) => {
        const res = await request.get(
        `${BASE}/payments/ipn/vnpay?vnp_ResponseCode=00&vnp_TxnRef=1_12345&vnp_Amount=10000&vnp_SecureHash=WRONG`
        );
        expect(res.status()).toBe(400);
    });

    test("TC2 - CALLBACK - Sai orderId → 400", async ({ request }) => {
        const res = await request.get(
        `${BASE}/payments/ipn/vnpay?vnp_ResponseCode=00&vnp_TxnRef=99999_12345&vnp_Amount=10000`
        );
        expect(res.status()).toBe(400);
    });

    test("TC3 - CALLBACK - Sai amount → đổi trạng thái thành PAYMENT_ERROR", async ({ request }) => {
        const correctHash = "dummy"; // không validate trong test này

        const res = await request.get(
        `${BASE}/payments/ipn/vnpay?vnp_ResponseCode=00&vnp_TxnRef=1_12345&vnp_Amount=99999900&vnp_SecureHash=${correctHash}`
        );

        expect(res.status()).toBe(400);
    });

    test("TC4 - CALLBACK - ResponseCode=24 → PAYMENT_FAILED", async ({ request }) => {
        const res = await request.get(
        `${BASE}/payments/ipn/vnpay?vnp_ResponseCode=24&vnp_TxnRef=${ORDER_ID}_1&vnp_Amount=10000`
        );
        expect(res.status()).toBe(200);

        const check = await request.get(`${BASE}/orders/${ORDER_ID}`);
        const body = await check.json();

        expect(body.status).toBe("PAYMENT_FAILED");
    });

    test("TC5 - CALLBACK - ResponseCode=00 (success) → PAID", async ({ request }) => {
        const res = await request.get(
        `${BASE}/payments/ipn/vnpay?vnp_ResponseCode=00&vnp_TxnRef=${ORDER_ID}_10&vnp_Amount=14000000`
        );
        expect(res.status()).toBe(200);

        const check = await request.get(`${BASE}/orders/${ORDER_ID}`);
        const body = await check.json();
        expect(body.status).toBe("PAID");
    });

    
});



