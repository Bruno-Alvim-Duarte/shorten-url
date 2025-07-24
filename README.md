<p style="align:center">
  <a href="./README_EN.md">English</a> | <a href=".">Português </a>
</p>

# URL Shortener Project

Este é um projeto de encurtador de URLs construído com uma arquitetura de microserviços usando NestJS e KrakenD como API Gateway.

## Estrutura do Projeto

O projeto é composto por três componentes principais:

- **url-shortener-service**: Responsável pelo encurtamento e redirecionamento de URLs
- **iam-service**: Serviço de Identity e Access Management para autenticação e autorização
- **krakend**: API Gateway que gerencia o roteamento e a comunicação entre os serviços

## Arquitetura

```
                   ┌─────────────────┐
                   │                 │
  Cliente ─────────►    KrakenD     │
                   │  (API Gateway)  │
                   │     :8080      │
                   └────────┬────────┘
                           │
                           │
              ┌───────────┴───────────┐
              │                       │
    ┌─────────┴──────┐      ┌────────┴─────────┐
    │                │      │                   │
    │  IAM Service  │      │ Shortener Service │
    │    :3001      │      │      :3000        │
    └────────┬──────┘      └─────────┬─────────┘
             │                       │
             └─────────┐  ┌─────────┘
                       │  │
                   ┌───┴──┴───┐
                   │          │
                   │ Postgres │
                   │          │
                   └──────────┘
```

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker
- Docker Compose
- npm (versão 8 ou superior)

## Instalação e Configuração

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd shorten-url
   ```

2. **Configure as variáveis de ambiente**

   Cada serviço possui um arquivo `.env.example` com as variáveis necessárias. Copie esses arquivos para `.env` em seus respectivos diretórios e ajuste os valores conforme necessário:

   ```bash
   # Para o root
   cp .env.example .env

   # Para o url-shortener-service
   cp services/url-shortener-service/.env.example services/url-shortener-service/.env

   # Para o iam-service
   cp services/iam-service/.env.example services/iam-service/.env
   ```

   Conteúdo do `.env.example`:

   ```env
   # Url que será utilizada para o gateway identificar pra onde tem que direcionar as requisições de IAM
   IAM_SERVICE_URL="http://iam-service:3001"
   # Url que será utilizada para o gateway identificar pra onde tem que direcionar as requisições de URL
   URL_SHORTENER_SERVICE_URL="http://url-shortener-service:3000"

   # Credenciais que serão usadas para criar o container do postgres
   DB_USER=
   DB_PASS=
   DB_NAME=
   DB_PORT=
   ```

   Conteúdo do `url-shortener-service/.env.example`:

   ```env
   # Shortener base url será usado pra retornar o url inteiro encurtado facilitando o acesso
   SHORTENER_BASE_URL=http://localhost:8080
   DATABASE_URL="postgresql://user:password@host:port/databaseName?schema=public"

   # ⚠️⚠️ Os JWT secrets precisam ser os mesmo entre os 2 serviços para validar o token em ambos
   JWT_SECRET=
   JWT_REFRESH_SECRET=
   ```

   Conteúdo do `iam-service/.env.example`:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/databaseName?schema=public"

   # ⚠️⚠️ Os JWT secrets precisam ser os mesmo entre os 2 serviços para validar o token em ambos
   JWT_SECRET=
   JWT_REFRESH_SECRET=
   ```

3. **Instale todas as dependências**

   ```bash
   npm run install:all
   ```

   Este comando instalará as dependências do projeto raiz e de todos os serviços.

4. **Inicie os serviços com Docker**

   ```bash
   npm run docker:up
   ```

   Este comando irá:

   - Construir as imagens Docker de todos os serviços
   - Iniciar os containers (incluindo o KrakenD API Gateway)
   - Executar as migrations do banco de dados automaticamente
   - Iniciar os logs do serviço de URL shortener

5. **Acessando os Serviços**

   Após iniciar os containers, os serviços estarão disponíveis através do KrakenD API Gateway:

   - API Gateway: http://localhost:8080
   - Endpoints de Autenticação: http://localhost:8080/api/auth/\*
   - Endpoints de URLs: http://localhost:8080/api/urls/\*

6. **Para parar os serviços**
   ```bash
   npm run docker:down
   ```

## Documentação

A documentação da API Gateway está disponível em: https://shorten-urlgateway-service.up.railway.app/api-gateway/docs

A documentação do URL Shortener Service está disponível em: https://url-shortener-service.up.railway.app/docs

A documentação do IAM Service está disponível em: https://iam-service.up.railway.app/docs

## Serviços

### URL Shortener Service

Serviço responsável por:

- Encurtar URLs longas
- Redirecionar URLs curtas para as originais
- Gerenciar estatísticas de acesso

### IAM Service

Serviço responsável por:

- Autenticação de usuários
- Gerenciamento de permissões
- Controle de acesso

### KrakenD API Gateway

Responsável por:

- Roteamento de requisições para os serviços apropriados
- Exposição de uma única porta para acesso aos serviços

## Desenvolvimento

Para desenvolvimento local, após instalar as dependências, você pode:

1. Usar o ambiente Docker (recomendado):

   ```bash
   npm run docker:up
   ```

2. Acompanhar os logs:
   ```bash
   npm run logs
   ```

## O que será preciso pra escalar horizontalmente

Para garantir que o sistema possa escalar horizontalmente de forma eficiente, alguns pontos importantes precisam ser considerados:

- **Implementação de Cache Distribuído**:

  - Utilizar Redis para compartilhar cache entre instâncias
  - Implementar cache de URLs frequentemente acessadas
  - Configurar estratégias de invalidação de cache eficientes
  - Usar cache para reduzir a carga no banco de dados

- **Arquitetura Stateless**:

  - Garantir que nenhuma informação de estado seja armazenada localmente nas instâncias
  - Mover todas as sessões para um armazenamento distribuído
  - Manter a arquitetura stateless

- **Otimização do Node.js**:

  - Configurar o Node.js em modo cluster para aproveitar múltiplos cores
  - Implementar worker threads para operações CPU-intensivas
  - Monitorar e ajustar o garbage collector

- **Implementação de Load Balancer**:

  - Utilizar um balanceador de carga para distribuir o tráfego entre as instâncias

- **Rate Limiting**:

  - Implementar o rate limiting para proteger o sistema contra ataques de força bruta e abuso de recursos
  - Api Gateway ja está criado basta configurar o rate limiting no arquivo de configuração do KrakenD

- **Implementação de Observabilidade**:

  - Implementar logging distribuído
  - Implementar monitoramento de métricas
  - Implementar tracing distribuído
  - Isso tudo com a intenção de identificar pontos de falha e melhorar a disponibilidade do sistema

- **Migração para Fastify**:
  - Substituir Express por Fastify como framework HTTP
  - Aproveitar o parsing de JSON mais rápido do Fastify
  - Utilizar o sistema de validação nativo do Fastify
  - Beneficiar-se do menor overhead por requisição

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
