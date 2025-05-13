# Performance Pilot Platform

Plataforma de gerenciamento e análise de campanhas publicitárias.

## Funcionalidades

- Dashboard com métricas em tempo real
- Gerenciamento de campanhas
- Integração com Google Ads API
- Análise de desempenho
- Relatórios personalizados
- Sistema de metas
- Alertas personalizados
- Gerenciamento de usuários e permissões

## Requisitos

- Node.js 18+
- Supabase
- Conta Google Ads com acesso à API

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/performance-pilot-platform.git
cd performance-pilot-platform
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas credenciais do Supabase e Google Ads.

4. Configure o Supabase:
- Crie um novo projeto no Supabase
- Execute o SQL de migração em `supabase/migrations/20240320000000_create_users_table.sql`
- Configure as políticas de segurança (RLS) conforme definido no SQL

5. Configure o Google Ads API:
- Crie um projeto no Google Cloud Console
- Ative a Google Ads API
- Configure as credenciais OAuth 2.0
- Adicione a URI de redirecionamento: `http://localhost:5173/oauth-callback` (desenvolvimento)
- Copie o Client ID e Client Secret para o arquivo `.env`

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos React
  ├── hooks/         # Hooks personalizados
  ├── integrations/  # Integrações com APIs externas
  ├── lib/           # Utilitários e configurações
  ├── pages/         # Páginas da aplicação
  └── App.tsx        # Componente principal
```

## Perfis de Acesso

- **Administrador**: Acesso completo a todas as funcionalidades
- **Usuário**: Acesso a todas as funcionalidades exceto configurações

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
