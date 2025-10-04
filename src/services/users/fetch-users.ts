import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'agent' | 'viewer';
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get(buildUrl('users', {}));
      return response.json<User[]>();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};

export const useFetchTechnicians = () => {
  const { data: users = [], ...rest } = useFetchUsers();
  
  const technicians = users.filter(user => user.role === 'agent' && user.ativo);
  
  return {
    data: technicians,
    ...rest
  };
};
