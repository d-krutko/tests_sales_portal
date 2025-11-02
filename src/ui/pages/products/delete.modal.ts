import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class ProductDeleteModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("div[name='confirmation-modal']");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly deleteButton = this.uniqueElement.locator(
    "button.btn-danger[type='submit']"
  );
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  async clickClose() {
    await this.closeButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
  }
}
