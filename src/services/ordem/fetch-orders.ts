import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface Ordem {
  id: string;
  cliente: string;
  descricao: string;
  status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';
  data_criacao: string;
  data_atualizacao: string;
  data_conclusao?: string;
  criado_por_id: string;
  responsavel_id?: string;
  criadoPor?: {
    id: string;
    nome: string;
    email: string;
  };
  responsavel?: {
    id: string;
    nome: string;
    email: string;
  };
}

export const useFetchOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Ordem[]> => {
      const response = await api.get(buildUrl('ordens', {}));
      return response.json<Ordem[]>();
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

