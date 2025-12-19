import { test, expect } from '@playwright/test';
import { CustomerHomePage } from '../Page/CustomerHomePage';
import { LoginPage } from '../Page/LogIn';
import { RestaurantPage } from '../Page/RestaurantHomePage';

test.describe('Chức năng Đăng nhập', () => {
    let customerHomePage: CustomerHomePage;
    let loginPage: LoginPage;
    let restaurantPage: RestaurantPage;
  
 //TC1
    test('TC1 - empty username and password', async ({ page }) => {
      const login = new LoginPage(page);
      const customer = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customer.loginButton.click();
      await login.performLogin('', '');
      await expect(login.messageBox).toHaveText('Vui lòng điền đầy đủ thông tin.');
    });
    //TC2
    test('TC2 - empty username', async ({ page }) => {
      const login = new LoginPage(page);
      const customer = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customer.loginButton.click();
      await login.performLogin('', '123456');
      await expect(login.messageBox).toHaveText('Vui lòng điền đầy đủ thông tin.');
    });
    //TC3
    test('TC3 - empty password', async ({ page }) => {
      const login = new LoginPage(page);
      const customer = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customer.loginButton.click();
      await login.performLogin('user1', '');
      await expect(login.messageBox).toHaveText('Vui lòng điền đầy đủ thông tin.');
    });
    //TC4
    test('TC4 - invalid password', async ({ page }) => {
      const login = new LoginPage(page);
      const customer = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customer.loginButton.click();
      await login.performLogin('A@', '12345');
      await expect(login.messageBox).toHaveText('Sai tên đăng nhập hoặc mật khẩu.');
    });
    //TC5
    test('TC5 - wrong username, password', async ({ page }) => {
      const login = new LoginPage(page);
      const customer = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customer.loginButton.click();
      await login.performLogin('ab', '123456');
      await expect(login.messageBox).toHaveText('Sai tên đăng nhập hoặc mật khẩu.');
    });
    //TC6 
    test('TC6 - customer login', async ({ page }) => {
      const login = new LoginPage(page);
      const customerHomePage = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customerHomePage.loginButton.click();
      await login.performLogin('A@', '123456');
      //await expect(login.messageBox).toHaveText("Đăng nhập thành công!");
      await expect(customerHomePage.advancedSearchBtn).toBeVisible();
    });
    //TC7
    test('TC7 - restaurant login', async ({ page }) => {
      const login = new LoginPage(page);
      const restaurantPage = new RestaurantPage(page);
      const customer = new CustomerHomePage(page);
      await page.goto('http://localhost:3000/');
      await customer.loginButton.click();
      await login.performLogin('huhu', '123456');
      //await expect(login.messageBox).toHaveText("Đăng nhập thành công!");
      await expect(restaurantPage.restaurantName).toBeVisible();
    });
});
