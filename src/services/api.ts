import { config } from '@/config/env';
import ky from 'ky';

const api = ky.create({
  prefixUrl: config.apiUrl,
  timeout: 10000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
afterResponse: [
  async (request, _options, response) => {
    if (response.status === 401 && !request.url.includes('/auth/refresh') && !request.url.includes('/auth/login')) {
      try {
        const refreshResponse = await ky.post(`${config.apiUrl}/auth/refresh`);

        if (refreshResponse.ok) {
          const { access_token } = await refreshResponse.json<{ access_token: string }>();
          localStorage.setItem('access_token', access_token);

          const newRequest = new Request(request.url, {
            method: request.method,
            headers: {
              ...Object.fromEntries(request.headers.entries()),
              'Authorization': `Bearer ${access_token}`,
            },
            body: request.body,
          });

          return ky(newRequest);
        }
      } catch (error) {
        localStorage.removeItem('access_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return response;
  },
],
    beforeError: [
      (error) => {
        console.error('API Error:', error);
        return error;
      },
    ],
  },
});

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export default api;