import { toast } from '@/hooks/use-toast';
import { buildUrl } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post(buildUrl('ordens/:orderId/check-in', {
        paths: { orderId }
      }));
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast({
        title: 'Status alterado com sucesso!',
        description: 'Ordem iniciada - status alterado para "Em Andamento".',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao alterar status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
