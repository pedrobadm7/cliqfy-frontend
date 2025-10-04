import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'VIEWER';
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useAuth = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User> => {
      const response = await api.get(buildUrl('auth/me', {}));
      return response.json<User>();
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
};