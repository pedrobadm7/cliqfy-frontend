import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Reports } from './index';

// Mock dos hooks
const mockUseAuth = vi.fn();
const mockUseFetchDailyReports = vi.fn();

vi.mock('@/services/auth/me', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/services/reports/fetch-reports', () => ({
  useFetchDailyReports: () => mockUseFetchDailyReports(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Reports Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render reports page for admin user', () => {
    mockUseAuth.mockReturnValue({
      data: {
        id: 'user-123',
        nome: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        ativo: true,
      },
    });

    mockUseFetchDailyReports.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<Reports />);

    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Análise de desempenho e estatísticas')).toBeInTheDocument();
  });

  it('should show access denied for non-admin users', () => {
    mockUseAuth.mockReturnValue({
      data: {
        id: 'user-456',
        nome: 'Regular User',
        email: 'user@test.com',
        role: 'agent',
        ativo: true,
      },
    });

    mockUseFetchDailyReports.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<Reports />);

    expect(screen.getByText('Acesso negado. Apenas administradores podem visualizar relatórios.')).toBeInTheDocument();
    expect(screen.getByText('Voltar ao Dashboard')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      data: {
        id: 'user-123',
        nome: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        ativo: true,
      },
    });

    mockUseFetchDailyReports.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    renderWithProviders(<Reports />);

    expect(screen.getByText('Carregando relatórios...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseAuth.mockReturnValue({
      data: {
        id: 'user-123',
        nome: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        ativo: true,
      },
    });

    mockUseFetchDailyReports.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to fetch reports'),
    });

    renderWithProviders(<Reports />);

    expect(screen.getByText('Erro ao carregar relatórios. Tente novamente.')).toBeInTheDocument();
  });
});