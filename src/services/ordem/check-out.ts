import { toast } from '@/hooks/use-toast';
import { buildUrl } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post(buildUrl('ordens/:orderId/check-out', {
        paths: { orderId }
      }));
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast({
        title: 'Status alterado com sucesso!',
        description: 'Ordem concluída - status alterado para "Concluída".',
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
