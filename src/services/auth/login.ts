import { useToast } from '@/hooks/use-toast';
import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    role: 'ADMIN' | 'AGENT' | 'VIEWER';
    ativo: boolean;
  };
}

export const useLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      console.log(buildUrl('auth/login', {}))
      const response = await api.post(buildUrl('auth/login', {}), { json: credentials });
      return response.json<LoginResponse>();
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      toast({
        title: 'Login realizado com sucesso',
        description: `Bem-vindo, ${data.user.nome}!`,
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Erro de login',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
