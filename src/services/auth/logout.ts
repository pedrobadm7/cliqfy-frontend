import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post(buildUrl('auth/logout', {}));
      return response.json();
    },
    onSuccess: () => {
      localStorage.removeItem('access_token');
      navigate('/login');
    },
    onError: () => {
      localStorage.removeItem('access_token');
      navigate('/login');
    },
  });
};