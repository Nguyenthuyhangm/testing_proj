import { type Locator, type Page } from '@playwright/test';

export class CustomerHomePage {
  readonly page: Page;
  // Header Elements
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly cartIcon: Locator;
  
  // Search Section
  readonly quickSearchInput: Locator;
  readonly advancedSearchBtn: Locator; // Nút cam "Tìm kiếm nâng cao"

  // Body Elements
  readonly registerPartnerBannerBtn: Locator; // Nút xanh "Đăng ký ngay!"
  
  constructor(page: Page) {
    this.page = page;
    // Header
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
    this.registerButton = page.getByRole('button', { name: 'Đăng ký', exact: true });
    this.cartIcon = page.locator('.cart-icon, text=Giỏ hàng'); // Cập nhật theo class thực tế

    // Search
    this.quickSearchInput = page.getByPlaceholder('Tìm kiếm món ăn...');
    this.advancedSearchBtn = page.getByRole('button', { name: 'Tìm kiếm nâng cao' });

    // Banner
    this.registerPartnerBannerBtn = page.getByRole('button', { name: 'Đăng ký ngay!' });
  }

  async goto() {
    await this.page.goto('http://localhost:3000/');
  }

  
  }

