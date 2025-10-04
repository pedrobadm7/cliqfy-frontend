import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/services/auth/me";
import { useFetchDailyReports } from "@/services/reports/fetch-reports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, BarChart3, Calendar, Clock, FileText, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function Reports() {
  const navigate = useNavigate();
  const { data: user } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 dias atrás
    to: format(new Date(), 'yyyy-MM-dd'), // hoje
  });

  const { data: reportsData, isLoading, error } = useFetchDailyReports(dateRange.from, dateRange.to);
  
  const reports = useMemo(() => {
    return Array.isArray(reportsData) ? reportsData : [];
  }, [reportsData]);

  const chartData = useMemo(() => {
    return reports.map(report => ({
      date: format(new Date(report.date), 'dd/MM', { locale: ptBR }),
      total: report.totalOrders,
      completed: report.completedOrders,
      open: report.openOrders,
      inProgress: report.inProgressOrders,
      cancelled: report.cancelledOrders,
    }));
  }, [reports]);

  const statusData = useMemo(() => {
    if (reports.length === 0) return [];
    
    const totals = reports.reduce((acc, report) => ({
      open: acc.open + report.openOrders,
      inProgress: acc.inProgress + report.inProgressOrders,
      completed: acc.completed + report.completedOrders,
      cancelled: acc.cancelled + report.cancelledOrders,
    }), { open: 0, inProgress: 0, completed: 0, cancelled: 0 });

    return [
      { name: 'Abertas', value: totals.open, color: '#eab308' },
      { name: 'Em Andamento', value: totals.inProgress, color: '#3b82f6' },
      { name: 'Concluídas', value: totals.completed, color: '#22c55e' },
      { name: 'Canceladas', value: totals.cancelled, color: '#ef4444' },
    ];
  }, [reports]);

  const totalStats = useMemo(() => {
    return reports.reduce((acc, report) => ({
      totalOrders: acc.totalOrders + report.totalOrders,
      completedOrders: acc.completedOrders + report.completedOrders,
      openOrders: acc.openOrders + report.openOrders,
      inProgressOrders: acc.inProgressOrders + report.inProgressOrders,
      cancelledOrders: acc.cancelledOrders + report.cancelledOrders,
    }), { 
      totalOrders: 0, 
      completedOrders: 0, 
      openOrders: 0, 
      inProgressOrders: 0, 
      cancelledOrders: 0 
    });
  }, [reports]);

  const averageCompletionRate = reports.length > 0 
    ? reports.reduce((acc, report) => acc + report.completionRate, 0) / reports.length 
    : 0;

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Acesso negado. Apenas administradores podem visualizar relatórios.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Erro ao carregar relatórios. Tente novamente.</p>
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
                Relatórios
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Análise de desempenho e estatísticas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(dateRange.from), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(dateRange.to), 'dd/MM/yyyy', { locale: ptBR })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Ordens</p>
                <p className="text-2xl font-bold">{totalStats.totalOrders}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ordens Concluídas</p>
                <p className="text-2xl font-bold">{totalStats.completedOrders}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold">
                  {Math.round(averageCompletionRate)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{totalStats.inProgressOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-lg font-semibold mb-4">Evolução das Ordens</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Concluídas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-lg font-semibold mb-4">Distribuição por Status</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fill="#8884d8"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição por Status
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="open" stackId="a" fill="#eab308" name="Abertas" />
                <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="Em Andamento" />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Concluídas" />
                <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Canceladas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </main>
    </div>
  );
}
