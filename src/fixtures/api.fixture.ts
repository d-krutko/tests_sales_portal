import { test as base, expect } from "@playwright/test";
import { LoginApi } from "tests/api/api/login.api";
import { ProductsApi } from "tests/api/api/products.api";
import { RequestApi } from "tests/api/apiClients/requestApi";
import { LoginService } from "tests/api/service/login.service";
import { ProductsApiService } from "tests/api/service/products.service";

interface IApi {
  // api
  productsApi: ProductsApi;
  loginApi: LoginApi;

  //services
  productsApiService: ProductsApiService;
  loginApiService: LoginService;
}

const test = base.extend<IApi>({
  //api
  productsApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new ProductsApi(apiClient);
    await use(api);
  },

  loginApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new LoginApi(apiClient);
    await use(api);
  },

  //services
  productsApiService: async ({ productsApi }, use) => {
    await use(new ProductsApiService(productsApi));
  },

  loginApiService: async ({ loginApi }, use) => {
    await use(new LoginService(loginApi));
  },
});

export { test, expect };
