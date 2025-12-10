import { Page, Locator } from '@playwright/test';

export class RestaurantPage {
  readonly page: Page;

  // Header elements
  readonly restaurantName: Locator;
  readonly logoutButton: Locator;

  // Tabs
  readonly overviewTab: Locator;
  readonly ordersTab: Locator;
  readonly menuTab: Locator;

  

  constructor(page: Page) {
    this.page = page;

    // Header
    this.restaurantName = page.locator('h1'); // Cập nhật theo tên nhà hàng thực tế
    this.logoutButton = page.locator('button', { hasText: 'Đăng xuất' });

    // Tabs
    this.overviewTab = page.locator('text=Tổng quan');
    this.ordersTab = page.locator('text=Đơn hàng');
    this.menuTab = page.locator('text=Thực đơn');
  }

  async isLoaded() {
    return this.restaurantName.isVisible();
  }

  async clickOverview() {
    await this.overviewTab.click();
  }

  async clickOrders() {
    await this.ordersTab.click();
  }

  async clickMenu() {
    await this.menuTab.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
