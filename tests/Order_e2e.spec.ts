import { test, expect } from '@playwright/test';

test.describe('Chức năng Đặt hàng', () => {

        test('test', async ({ page }) => {
        await page.goto('http://localhost:3000/');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();

        // Login steps
        await page.getByRole('textbox', { name: 'Tên đăng nhập' }).click();
        await page.getByRole('textbox', { name: 'Tên đăng nhập' }).fill('A@');
        await page.getByRole('textbox', { name: 'Mật khẩu' }).click();
        await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('123456');
        await page.getByRole('button', { name: 'Đăng nhập' }).click();
        await expect(page.getByRole('button', { name: '🛒 Thêm vào giỏ' }).first()).toBeVisible();

        //Order steps
        await page.getByRole('button', { name: '🛒 Thêm vào giỏ' }).first().click();
        await page.getByText('Giỏ hàng').click();
        await expect(page.locator('span').filter({ hasText: /^1$/ })).toBeVisible();

        await page.getByRole('button', { name: 'Đặt hàng ngay' }).click();
        await page.getByRole('button', { name: 'Tiếp tục →' }).click();

        await page.locator('input[name="fullName"]').click();
        await page.locator('input[name="fullName"]').fill('a');
        await page.locator('input[name="phone"]').click();
        await page.locator('input[name="phone"]').fill('0372375210');
        await page.locator('input[name="street"]').click();
        await page.locator('input[name="street"]').fill('aa');
        await page.locator('select[name="province"]').selectOption('Thành phố Hà Nội');
        await page.locator('select[name="district"]').selectOption('Quận Hoàng Mai');
        await page.locator('input[name="ward"]').click();
        await page.locator('input[name="ward"]').fill('aa');
        await page.getByRole('button', { name: 'Tiếp tục →' }).click();
        await page.getByRole('button', { name: '🎉 Xác nhận Đặt hàng' }).click();
        await page.getByText('Thanh toán khi nhận hàng').click();
        await page.getByRole('button', { name: '✅ Xác nhận đặt hàng' }).click();
        await page.getByRole('button', { name: 'Đơn hàng của tôi' }).click();
        await page.getByText('Xem chi tiết →').first().click();
        await page.getByRole('heading', { name: 'cá hồi sốt cam' }).click();
        await page.getByText('aa', { exact: true }).click();
        await page.getByText('Quận Hoàng Mai, Thành phố Hà').click();
        await page.getByText('cash').click();
        });






});