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
      (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
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
