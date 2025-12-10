import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitBtn: Locator;
  readonly registerLink: Locator;
  readonly closeButton: Locator;
  readonly messageBox : Locator;

  constructor(page: Page) {
    this.page = page;
    // Dựa trên label trong ảnh
    this.usernameInput = page.getByLabel('Tên đăng nhập', { exact: false }); 
    // Nếu không bắt được bằng label, dùng placeholder hoặc input[type="text"]
    
    this.passwordInput = page.getByLabel('Mật khẩu');
    this.loginSubmitBtn = page.getByRole('button', { name: 'Đăng nhập' });
    this.registerLink = page.getByText('Đăng ký', { exact: true });
    this.closeButton = page.locator('.modal-close-btn'); // Cần class cụ thể của nút X
    this.messageBox = page.locator('.auth-error',{ hasText: '' });
  }

  async performLogin(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginSubmitBtn.click();
  }
}
