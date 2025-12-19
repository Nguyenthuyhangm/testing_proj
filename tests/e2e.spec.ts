import { test, expect } from '@playwright/test';

test('Thanh toán thành công bằng VNPay', async ({ page }) => {

  // --- LOGIN ---
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await page.getByRole('textbox', { name: 'Tên đăng nhập' }).fill('demo_user@');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('hanghuyen112005');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Chờ login vào trang chính
  await expect(page.getByText('Xin chào')).toBeVisible({ timeout: 10000 });

  // --- ADD TO CART ---
  await page.getByRole('button', { name: '🛒 Thêm vào giỏ' }).first().click();

  await page.getByText('Giỏ hàng', { exact: true }).click();

  // --- CHECKOUT ---
  await page.getByRole('button', { name: 'Đặt hàng ngay' }).click();

  // Địa chỉ
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.getByText('123Stress, gogo, Quận Hai Bà').click();
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();

  // Xác nhận đặt hàng
  await page.getByRole('button', { name: '🎉 Xác nhận Đặt hàng' }).click();

  // --- PAY WITH VNPAY ---
  const vnpayBtn = page.getByRole('button', { name: '💳 Thanh toán với VNPay' });
  await expect(vnpayBtn).toBeVisible();
  await vnpayBtn.click();

  // --- EXPECT THÀNH CÔNG ---
  // Tùy hệ thống của bạn, có 3 cách verify:

  // 1️⃣ Nếu redirect sang URL của VNPay
  await expect(page).toHaveURL(/vnpay/i, { timeout: 15000 });

  // 2️⃣ Hoặc hệ thống hiện thông báo “Tạo giao dịch thành công”
  // await expect(page.getByText('Thanh toán VNPay thành công')).toBeVisible();

  // 3️⃣ Hoặc hiện màn hình "Đang xử lý thanh toán"
  // await expect(page.getByText('Đang xử lý')).toBeVisible();
});

test('auto fill Đặt hàng và thanh toán COD — chuyển về trang chủ', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Login
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.getByRole('textbox', { name: 'Tên đăng nhập' }).fill('demo_user@');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('hanghuyen112005');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Add to cart
  await page.getByRole('button', { name: '🛒 Thêm vào giỏ' }).nth(1).click();

  // Go to cart
await page.getByText('🛒Giỏ hàng1').click();
  // Checkout flow
  await page.getByRole('button', { name: 'Đặt hàng ngay' }).click();
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.getByText('123Stress, gogo, Quận Hai Bà').click();
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();

  // Confirm order
  await page.getByRole('button', { name: '🎉 Xác nhận Đặt hàng' }).click();

  // Chọn COD
  await page.getByText('Thanh toán khi nhận hàng').click();

  await page.getByRole('button', { name: '✅ Xác nhận đặt hàng' }).click();

  // --- ASSERT: TRANG CHỦ ---
  await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });

  // hoặc assert text đặc trưng trang chủ
  // await expect(page.getByText(/trang chủ|sản phẩm/i)).toBeVisible();
});
test('Fill - Đặt hàng cod', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Login
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await page.getByRole('textbox', { name: 'Tên đăng nhập' }).fill('demo_user@');
  await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('hanghuyen112005');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Add to cart
  await page.getByRole('button', { name: '🛒 Thêm vào giỏ' }).nth(1).click();

  // Go to cart
await page.getByText('🛒Giỏ hàng1').click();
  // Checkout flow
  await page.getByRole('button', { name: 'Đặt hàng ngay' }).click();
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.getByText('123Stress, gogo, Quận Hai Bà').click();
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();

  // Confirm order
  await page.getByRole('button', { name: '🎉 Xác nhận Đặt hàng' }).click();

  // Chọn COD
  await page.getByText('Thanh toán khi nhận hàng').click();

  await page.getByRole('button', { name: '✅ Xác nhận đặt hàng' }).click();

  // --- ASSERT: TRANG CHỦ ---
  await expect(page).toHaveURL('http://localhost:3000/', { timeout: 10000 });

  // hoặc assert text đặc trưng trang chủ
  // await expect(page.getByText(/trang chủ|sản phẩm/i)).toBeVisible();
});

