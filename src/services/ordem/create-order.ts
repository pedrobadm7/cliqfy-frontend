import { toast } from '@/hooks/use-toast';
import { buildUrl } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Ordem } from './fetch-orders';

export interface CreateOrderRequest {
  cliente: string;
  descricao: string;
  criado_por_id: string;
  responsavel_id?: string;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderRequest): Promise<Ordem> => {
      const response = await api.post(buildUrl('ordens', {}), { 
        json: orderData 
      });
      
      return response.json<Ordem>();
    },
    onSuccess: (newOrder) => {

      queryClient.invalidateQueries({queryKey: ['orders']});
      
      toast({
        title: 'Ordem criada com sucesso!',
        description: `A ordem para ${newOrder.cliente} foi registrada no sistema.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar ordem',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};