import { buildUrl } from '@/lib/utils';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface DailyReport {
  date: string;
  totalOrders: number;
  openOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
}

export const useFetchDailyReports = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['reports', 'daily', dateFrom, dateTo],
    queryFn: async (): Promise<DailyReport[]> => {
      const params: Record<string, string> = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      
      const response = await api.get(buildUrl('ordens/reports/daily', params));
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      }
      
      if (data && typeof data === 'object' && 'date' in data) {
        return [data as DailyReport];
      }
      
      return [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
