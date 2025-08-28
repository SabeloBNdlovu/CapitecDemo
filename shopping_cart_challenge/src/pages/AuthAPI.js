export class AuthAPI {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} baseURL
   */
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async authenticate(username, password) {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username,
        password,
      },
    });

    return response;
  }
}