import { test, expect} from '@playwright/test';
import { AuthAPI } from '../../pages/AuthAPI.js';
import { validCredentials, invalidCredentials } from '../../data/authData.js';

test.describe('Basic Authentication API Tests', () => {
  test('Test should successfully authenticate and return a token', async ({ request, baseURL }) => {
    const authAPI = new AuthAPI(request, baseURL);
    const response = await authAPI.authenticate(validCredentials.username, validCredentials.password);

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  test('Test should fail to authenticate with invalid credentials', async ({ request, baseURL }) => {
    const authAPI = new AuthAPI(request, baseURL);
    const response = await authAPI.authenticate(invalidCredentials.username, invalidCredentials.password);

    expect(response.status()).toBe(200); // status code returned from server should be 401 unauthorized

    const body = await response.json();
    
    expect(body).toHaveProperty('reason');
    expect(body.reason).toBe('Bad credentials');
  });
});
