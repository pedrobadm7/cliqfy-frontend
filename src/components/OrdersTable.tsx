import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ordem } from "@/services/ordem/fetch-orders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface OrdersTableProps {
  orders: Ordem[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusConfig = {
  aberta: { label: "Aberta", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
  em_andamento: { label: "Em Andamento", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  concluida: { label: "Concluída", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  cancelada: { label: "Cancelada", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
};

export function OrdersTable({ orders, isLoading, page, totalPages, onPageChange }: OrdersTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead>Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhuma ordem de serviço encontrada
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/ordem/${order.id}`)}
                >
                  <TableCell className="font-medium font-mono text-sm">
                    {order.id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>{order.cliente}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={order.descricao}>
                    {order.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[order.status].className}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.data_criacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {order.responsavel ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{order.responsavel.nome}</span>
                        <span className="text-xs text-muted-foreground">{order.responsavel.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => onPageChange(p)}
                  isActive={p === page}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
