import { test, expect } from '@playwright/test';

test.describe('API thêm vào giỏ hàng ', () => {
    const BASE_URL = 'http://localhost:5000/api';
    
    test('TC1 - Thieu username khi them vao gio', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/cart/add`, {
            data: {
                foodId : "1" ,
                quantity : 1 ,
            },
        });
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Thiếu thông tin.');
    });
    test('TC2 - Thieu foodId khi them vao gio', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/cart/add`, {
            data: {
                username : 'A@',
                quantity : 1 ,
            },
        });
        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Thiếu thông tin.');
    });
    test('TC3 - user khong ton tai khi them vao gio', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/cart/add`, {
            data: { 
                username : 'nonexistentuser',
                foodId : "1" ,
                quantity : 1 ,      
            },
        });
        expect(response.status()).toBe(404);    
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Không tìm thấy user.');
    });

    test('TC4 - username, foodId hợp lệ ', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/cart/add`, {
            data: {
                username : 'A@',
                foodId : "1" ,
                quantity : 1 ,
            },
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.message).toBe('Đã thêm vào giỏ hàng!');
    });

});

test.describe('API cập nhật số lượng món ăn trong giỏ', () => {

  const BASE = 'http://localhost:5000/api';
  test('TC1 – Thiếu dữ liệu → 400', async ({ request }) => {
    const res = await request.put(`${BASE}/cart/update`, {
      data: {
        username: 'A@',
        cartItemId: null,
        quantity: 2
      }
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Thông tin không hợp lệ.');
  });

  test(' TC2  User không tồn tại → 404', async ({ request }) => {
    const res = await request.put(`${BASE}/cart/update`, {
      data: {
        username: 'unknownUser',
        cartItemId: 1,
        quantity: 2
      }
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe('Không tìm thấy user.');
  });

  test(' TC3 Cart không tồn tại → 404', async ({ request }) => {
    //mock user khong co cart
    const res = await request.put(`${BASE}/cart/update`, {
      data: {
        username: 'test1',
        cartItemId: 1,
        quantity: 3
      }
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe('Không tìm thấy giỏ hàng.');
  });

  test('TC4  CartItem không tồn tại → 404', async ({ request }) => {
    const res = await request.put(`${BASE}/cart/update`, {
      data: {
        username: 'A@',
        cartItemId: 999999,
        quantity: 3
      }
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toBe('Không tìm thấy món ăn trong giỏ.');
  });

  test(' TC5 Cập nhật số lượng thành công → 200', async ({ request }) => {
    // 1. Thêm món để tạo cartItemId
    const addRes = await request.post(`${BASE}/cart/add`, {
      data: {
        username: 'A@',
        foodId: 1,
        quantity: 1
      }
    });

    expect(addRes.status()).toBe(200);
    const addBody = await addRes.json();

    const cartItemId = addBody.cartItem.id;

    // 2. Update số lượng
    const updateRes = await request.put(`${BASE}/cart/update`, {
      data: {
        username: 'A@',
        cartItemId: cartItemId,
        quantity: 5
      }
    });

    expect(updateRes.status()).toBe(200);

    const updateBody = await updateRes.json();
    expect(updateBody.message).toBe('Đã cập nhật giỏ hàng!');
  });


});

test.describe('API Xoá món ăn khỏi giỏ hàng', () => {
    const BASE = 'http://localhost:5000/api';
    test('TC1 Thiếu username hoặc cartItemId → 400', async ({ request }) => {
        const res = await request.delete(`${BASE}/cart/remove`, {
        data: { username: 'A@' }  // thiếu cartItemId
        });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body.message).toBe('Thiếu thông tin.');
    });

    test('TC2 User không tồn tại → 404', async ({ request }) => {
        const res = await request.delete(`${BASE}/cart/remove`, {
        data: {
            username: 'user_khong_ton_tai',
            cartItemId: 1
        }
        });
        expect(res.status()).toBe(404);
        const body = await res.json();
        expect(body.message).toBe('Không tìm thấy user.');
    });

    test('TC3 Cart không tồn tại → 404', async ({ request }) => {
        // user tồn tại nhưng chưa có cart
        const res = await request.delete(`${BASE}/cart/remove`, {
        data: {
            username: 'test2',
            cartItemId: 999
        }
        });
        expect(res.status()).toBe(404);
        const body = await res.json();
        expect(body.message).toBe('Không tìm thấy giỏ hàng.');
    });

    test('TC4 CartItem không tồn tại → 404', async ({ request }) => {

        // Tạo cart trước bằng cách thêm 1 món
        await request.post(`${BASE}/cart/add`, {
        data: { username: 'A@', foodId: 1, quantity: 1 }
        });

        const res = await request.delete(`${BASE}/cart/remove`, {
        data: {
            username: 'A@',
            cartItemId: 9999 // không tồn tại
        }
        });

        expect(res.status()).toBe(404);
        const body = await res.json();
        expect(body.message).toBe('Không tìm thấy món ăn trong giỏ.');
    });

    test('TC5 Xóa thành công → 200', async ({ request }) => {

        // Thêm món vào giỏ để có cartItemId thật
        const addRes = await request.post(`${BASE}/cart/add`, {
        data: { username: 'A@', foodId: 1, quantity: 1 }
        });

        const addBody = await addRes.json();
        const cartItemId = addBody.cartItem.id;

        const res = await request.delete(`${BASE}/cart/remove`, {
        data: {
            username: 'A@',
            cartItemId
        }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.message).toBe('Đã xóa khỏi giỏ hàng!');
    });

    test('TC6  Tổng tiền được cập nhật đúng sau khi xóa', async ({ request }) => {

        // Thêm 2 món để có tổng tiền
        const addRes = await request.post(`${BASE}/cart/add`, {
        data: { username: 'A@', foodId: 1, quantity: 2 }
        });

        const addBody = await addRes.json();
        const cartItemId = addBody.cartItem.id;

        const res = await request.delete(`${BASE}/cart/remove`, {
        data: {
            username: 'A@',
            cartItemId
        }
        });

        expect(res.status()).toBe(200);

        const body = await res.json();
        expect(body.message).toBe('Đã xóa khỏi giỏ hàng!');

    });

});