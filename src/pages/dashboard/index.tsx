
import NewOrderDialog from '@/components/NewOrderDialog';
import { OrdersFilters } from '@/components/OrdersFilters';
import { OrdersTable } from '@/components/OrdersTable';
import { Button } from "@/components/ui/button";
import { useLogout } from '@/services/auth/logout';
import { useFetchOrders } from '@/services/ordem/fetch-orders';
import { LogOut, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function Dashboard() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false);

  const { data: orders = [], isLoading, error } = useFetchOrders();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    if (filters.search) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.cliente.toLowerCase().includes(filters.search.toLowerCase()) ||
          order.descricao.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }
    
    return filtered;
  }, [orders, filters]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, page]);

  const totalPages = Math.ceil(filteredOrders.length / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ordens de Serviço
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie suas ordens de manutenção
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="gap-2" onClick={() => setOpenNewOrderDialog(true)}>
              <Plus className="h-4 w-4" />
              Nova Ordem
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <OrdersFilters filters={filters} onFiltersChange={setFilters} />
          <OrdersTable
            orders={paginatedOrders}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>
      <NewOrderDialog open={openNewOrderDialog} onOpenChange={setOpenNewOrderDialog} />
    </div>
  );
}
