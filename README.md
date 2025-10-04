# Cliqfy Frontend

Frontend da aplicação Cliqfy desenvolvido em React com TypeScript, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Query** - Gerenciamento de estado do servidor
- **React Router DOM** - Roteamento
- **Radix UI** - Componentes acessíveis
- **Recharts** - Biblioteca de gráficos
- **Zod** - Validação de schemas
- **Vitest** - Framework de testes

## 📋 Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd cliqfy-frontend
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Atualize as variáveis no `.env`:
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Executando a aplicação

### Desenvolvimento
```bash
pnpm dev
```

### Build para produção
```bash
pnpm build
```

### Preview da build
```bash
pnpm preview
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test:run

# Executar testes em modo watch
pnpm test

# Executar testes com cobertura
pnpm test:coverage

# Interface gráfica dos testes
pnpm test:ui
```

## 📊 Scripts disponíveis

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Compila para produção
- `pnpm preview` - Preview da build de produção
- `pnpm lint` - Executa linter
- `pnpm test` - Executa testes em modo watch
- `pnpm test:run` - Executa todos os testes
- `pnpm test:coverage` - Executa testes com cobertura
- `pnpm test:ui` - Interface gráfica dos testes

## 🏗️ Estrutura do projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Radix UI)
│   ├── LoginForm.tsx
│   ├── OrdersTable.tsx
│   ├── OrdersFilters.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── pages/              # Páginas da aplicação
│   ├── auth/
│   │   └── login/
│   ├── dashboard/
│   ├── order-detail/
│   ├── reports/
│   └── not-found/
├── services/           # Serviços de API
│   ├── api.ts         # Cliente HTTP base
│   ├── auth/          # Serviços de autenticação
│   ├── ordem/         # Serviços de ordens
│   └── reports/       # Serviços de relatórios
├── hooks/             # Custom hooks
├── lib/               # Utilitários
├── config/            # Configurações
├── router/            # Configuração de rotas
└── utils/             # Funções utilitárias
```

## 🔐 Autenticação

A aplicação implementa autenticação JWT com refresh tokens:

- **Login**: Credenciais → Access Token + Refresh Token (cookie)
- **Refresh**: Renovação automática do access token
- **Logout**: Limpeza de tokens e redirecionamento

### Fluxo de autenticação:
1. Usuário faz login
2. Backend retorna access token e define refresh token em cookie
3. Frontend armazena access token e faz requisições autenticadas
4. Interceptor renova automaticamente tokens expirados
5. Em caso de falha, redireciona para login

## 👥 Sistema de Roles (RBAC)

Controle de acesso baseado em roles:

- **admin**: Acesso total, pode criar ordens e ver relatórios
- **agent**: Pode gerenciar ordens atribuídas, fazer check-in/check-out
- **viewer**: Apenas visualização de ordens

### Implementação:
- `ProtectedRoute` - Protege rotas autenticadas
- `PublicRoute` - Redireciona usuários logados
- Verificação de roles para elementos da UI

## 📋 Funcionalidades

### Dashboard
- Lista de ordens com filtros
- Botão "Nova Ordem" (apenas admin)
- Botão "Relatórios" (apenas admin)
- Filtro por ordens atribuídas (agent)

### Gestão de Ordens
- Criação de novas ordens
- Visualização detalhada com timeline
- Check-in/Check-out (agent)
- Filtros por status, cliente, responsável

### Relatórios
- Gráficos de evolução das ordens
- Distribuição por status
- Estatísticas de conclusão
- Acesso restrito a admins

### Timeline de Ordens
- Histórico cronológico de eventos
- Status changes com timestamps
- Atribuição de responsáveis
- Conclusão de ordens

## 🎨 Design System

### Componentes base (Radix UI)
- Button, Input, Select, Card
- Dialog, Toast, Alert
- Table, Pagination
- Accordion, Avatar, Badge

### Estilização
- **Tailwind CSS** para estilos utilitários
- **CSS Variables** para temas
- **Responsive design** mobile-first
- **Dark mode** support (preparado)

### Cores
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Mobile**: Layout adaptado para telas pequenas
- **Tablet**: Layout intermediário
- **Desktop**: Layout completo

## 🔧 Configuração

### Variáveis de ambiente
```env
VITE_API_URL=http://localhost:3000  # URL da API backend
```

### Cliente HTTP (api.ts)
- Base URL configurável
- Interceptors para autenticação
- Refresh automático de tokens
- Tratamento de erros

## 🧪 Testes

### Configuração
- **Vitest** como test runner
- **jsdom** como ambiente DOM
- **@testing-library/react** para testes de componentes
- **@testing-library/jest-dom** para matchers

### Estrutura de testes
```typescript
// Exemplo de teste
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🚀 Deploy

### Build de produção
```bash
pnpm build
```

### Variáveis de ambiente para produção
```env
VITE_API_URL=https://api.cliqfy.com
```

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🚨 Troubleshooting

### Problemas comuns:

1. **Erro de CORS**:
   - Verifique se o backend está configurado para aceitar requisições do frontend

2. **Erro de autenticação**:
   - Verifique se as variáveis de ambiente estão corretas
   - Confirme se o backend está rodando

3. **Erro de build**:
   - Execute `pnpm install` para reinstalar dependências
   - Verifique se todas as variáveis de ambiente estão definidas

4. **Problemas com testes**:
   - Execute `pnpm test:run` para verificar se os testes passam
   - Verifique se o setup do Vitest está correto

## 🚧 Melhorias Futuras

### Funcionalidades Planejadas
- **Mais testes**: Cobertura completa de componentes e hooks
- **Tratamento de erros**: Error boundaries e mensagens amigáveis
- **Loading states**: Skeletons e spinners para melhor UX
- **Notificações**: Sistema de notificações em tempo real
- **Tema escuro**: Implementação completa do dark mode
- **PWA**: Transformar em Progressive Web App
- **Offline support**: Funcionalidade offline básica
- **Internacionalização**: Suporte a múltiplos idiomas

### Melhorias Técnicas
- **Testes E2E**: Cypress ou Playwright para testes end-to-end
- **Performance**: Lazy loading, code splitting, otimização de bundle
- **Acessibilidade**: Melhorar acessibilidade (WCAG 2.1)
- **SEO**: Meta tags, sitemap, structured data
- **Analytics**: Google Analytics ou similar
- **Error tracking**: Sentry ou similar para monitoramento de erros

### UX/UI
- **Animações**: Micro-interações e transições suaves
- **Responsividade**: Melhorar experiência mobile
- **Acessibilidade**: Screen readers, navegação por teclado
- **Feedback visual**: Estados de loading, sucesso, erro
- **Validação em tempo real**: Validação de formulários em tempo real

### Arquitetura
- **State management**: Redux Toolkit ou Zustand para estado global
- **Micro-frontends**: Separar em módulos independentes
- **Design tokens**: Sistema de design mais robusto
- **Component library**: Biblioteca de componentes reutilizáveis

## 📄 Licença

Este projeto está sob a licença MIT.