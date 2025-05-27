# URL Shortener Project

Este é um projeto de encurtador de URLs construído com uma arquitetura de microserviços usando NestJS.

## Estrutura do Projeto

O projeto é composto por dois serviços principais:

- **url-shortener-service**: Responsável pelo encurtamento e redirecionamento de URLs
- **iam-service**: Serviço de Identity e Access Management para autenticação e autorização

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
   # Porta que vai ser vinculada pra acessar IAM localmente
   IAM_PORT=

   # Porta que vai ser vinculada pra acessar Shortener localmente
   SHORTENER_PORT=

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

   > **Importante**: Certifique-se de nunca commitar os arquivos `.env` no repositório. Eles já estão incluídos no `.gitignore`.

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
   - Iniciar os containers
   - Executar as migrations do banco de dados automaticamente
   - Iniciar os logs do serviço de URL shortener

5. **Para parar os serviços**
   ```bash
   npm run docker:down
   ```

## Scripts Disponíveis

- `npm run install:all` - Instala todas as dependências (root + serviços)
- `npm run docker:up` - Inicia todos os serviços em containers Docker
- `npm run docker:down` - Para e remove os containers Docker
- `npm run logs` - Mostra os logs do serviço de URL shortener
- `npm run build` - Compila todos os serviços
- `npm run test` - Executa os testes de todos os serviços
- `npm run test:cov` - Executa os testes com cobertura

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

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
