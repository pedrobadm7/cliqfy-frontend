import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/services/auth/me";
import { useCheckIn } from "@/services/ordem/check-in";
import { useCheckOut } from "@/services/ordem/check-out";
import { Ordem, useFetchOrders } from "@/services/ordem/fetch-orders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, ArrowLeft, Calendar, Clock, Play, Square, User } from "lucide-react";
import { useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";

const statusConfig = {
  aberta: { label: "Aberta", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20" },
  em_andamento: { label: "Em Andamento", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  concluida: { label: "Concluída", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
  cancelada: { label: "Cancelada", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
};

interface TimelineEvent {
  id: string;
  tipo: "criacao" | "atribuicao" | "status_change" | "conclusao" | "cancelamento";
  descricao: string;
  data: string;
  usuario: string;
  observacao?: string;
}

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user } = useAuth();
  const { data: orders = [], isLoading } = useFetchOrders();
  const { mutate: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();
  
  const order = useMemo(() => orders.find(o => o.id === id) || null, [orders, id]);
  
  const canManageOrder = user?.role === 'admin' || 
    (user?.role === 'agent' && order?.responsavel_id === user.id);

  const generateTimeline = (order: Ordem): TimelineEvent[] => {
    const timeline: TimelineEvent[] = [];

    timeline.push({
      id: "1",
      tipo: "criacao",
      descricao: "Ordem de serviço criada",
      data: order.data_criacao,
      usuario: order.criadoPor?.nome || "Sistema",
      observacao: `Cliente: ${order.cliente}`
    });

    if (order.responsavel) {
      timeline.push({
        id: "2",
        tipo: "atribuicao",
        descricao: "Técnico responsável atribuído",
        data: order.data_atualizacao,
        usuario: order.responsavel.nome,
        observacao: `Responsável: ${order.responsavel.nome}`
      });
    }

    if (order.status !== 'aberta') {
      timeline.push({
        id: "3",
        tipo: "status_change",
        descricao: `Status alterado para ${statusConfig[order.status]?.label || order.status}`,
        data: order.data_atualizacao,
        usuario: order.responsavel?.nome || "Sistema",
        observacao: `Status atual: ${statusConfig[order.status]?.label || order.status}`
      });
    }

    if (order.status === 'concluida' && order.data_conclusao) {
      timeline.push({
        id: "4",
        tipo: "conclusao",
        descricao: "Ordem de serviço concluída",
        data: order.data_conclusao,
        usuario: order.responsavel?.nome || "Sistema",
        observacao: "Serviço finalizado com sucesso"
      });
    }

    // Se cancelada, mostrar cancelamento
    if (order.status === 'cancelada') {
      timeline.push({
        id: "5",
        tipo: "cancelamento",
        descricao: "Ordem de serviço cancelada",
        data: order.data_atualizacao,
        usuario: order.responsavel?.nome || "Sistema",
        observacao: "Ordem cancelada"
      });
    }

    // Ordenar por prioridade lógica, não apenas por data
    const priorityOrder = {
      'criacao': 1,
      'atribuicao': 2,
      'status_change': 3,
      'conclusao': 4,
      'cancelamento': 5
    };

    return timeline.sort((a, b) => {
      // Primeiro por prioridade lógica
      const priorityDiff = priorityOrder[a.tipo] - priorityOrder[b.tipo];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Se mesma prioridade, ordenar por data
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });
  };

  const getTimelineIcon = (tipo: TimelineEvent["tipo"]) => {
    switch (tipo) {
      case "criacao":
        return <AlertCircle className="h-5 w-5" />;
      case "atribuicao":
        return <User className="h-5 w-5" />;
      case "status_change":
        return <Clock className="h-5 w-5" />;
      case "conclusao":
        return <Calendar className="h-5 w-5" />;
      case "cancelamento":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getTimelineColor = (tipo: TimelineEvent["tipo"]) => {
    switch (tipo) {
      case "criacao":
        return "bg-yellow-500";
      case "atribuicao":
        return "bg-blue-500";
      case "status_change":
        return "bg-orange-500";
      case "conclusao":
        return "bg-green-500";
      case "cancelamento":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando ordem de serviço...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Ordem de serviço não encontrada</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Detalhes da Ordem de Serviço
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={statusConfig[order.status].className}>
                {statusConfig[order.status].label}
              </Badge>
              
              {canManageOrder && (
                <div className="flex gap-2">
                  {order.status === 'aberta' && (
                    <Button
                      size="sm"
                      onClick={() => checkIn(order.id)}
                      disabled={isCheckingIn}
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isCheckingIn ? 'Iniciando...' : 'Iniciar'}
                    </Button>
                  )}
                  
                  {order.status === 'em_andamento' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => checkOut(order.id)}
                      disabled={isCheckingOut}
                      className="gap-2"
                    >
                      <Square className="h-4 w-4" />
                      {isCheckingOut ? 'Finalizando...' : 'Finalizar'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1 h-fit animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Informações</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{order.cliente}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="font-medium">{order.descricao}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Técnico Responsável</p>
                <p className="font-medium">{order.responsavel?.nome || "Não atribuído"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium">
                  {format(new Date(order.data_criacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="font-medium">
                  {format(new Date(order.data_atualizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              {order.data_conclusao && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Conclusão</p>
                    <p className="font-medium">
                      {format(new Date(order.data_conclusao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-lg font-semibold mb-6">Timeline</h2>
            <div className="relative">
              <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border"></div>
              
              <div className="space-y-6">
                {order && generateTimeline(order).map((event, index) => (
                  <div key={event.id} className="relative pl-12 pb-6 last:pb-0">
                    <div className={`absolute left-0 top-0 w-12 h-12 rounded-full ${getTimelineColor(event.tipo)} flex items-center justify-center text-white shadow-lg`}>
                      {getTimelineIcon(event.tipo)}
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{event.descricao}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {format(new Date(event.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <User className="h-3 w-3 inline mr-1" />
                        {event.usuario}
                      </p>
                      {event.observacao && (
                        <p className="text-sm mt-2 italic">{event.observacao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}