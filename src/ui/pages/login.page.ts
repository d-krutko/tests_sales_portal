import { ICredentials } from "data/types/credentials.types";
import { BasePage } from "./base.page";
import { SALES_PORTAL_URL } from "config/env";

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator("#emailinput");
  readonly passwordInput = this.page.locator("#passwordinput");
  readonly loginButton = this.page.locator(".loginBtn");

  async open() {
    await this.page.goto(SALES_PORTAL_URL);
  }

  async fillCredentials(creds: ICredentials) {
    await this.emailInput.fill(creds.username);
    await this.passwordInput.fill(creds.password);
  }

  async clickOnLoginButton() {
    await this.loginButton.click();
  }
}
