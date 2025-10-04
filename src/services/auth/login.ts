import { useToast } from '@/hooks/use-toast';
import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User } from './me';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
}

export const useLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await api.post(buildUrl('auth/login', {}), { json: credentials });
      return response.json<LoginResponse>();
    },
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.access_token);

      const userResponse = await api.get<User>(buildUrl('auth/me', {}));
      const user = await userResponse.json();

      queryClient.setQueryData(['auth', 'me'], user);

      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${user.nome}!`,
        duration: 3000,
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Erro de login',
        description: error.message,
        variant: 'destructive',
        duration: 3000,
      });
    },
  });
};
