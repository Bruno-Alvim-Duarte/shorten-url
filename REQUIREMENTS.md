# Encurtador de URL

Decisões:

- meu_dominio.com/aZbKq7 —> aZbKq7 ID —> https://dominiolongo.com/wspass/qwq/sa/sa
- MySQL - foi exigido um banco de dados relacional. Mas eu provavelmente escolheria por:
  - MongoDB - Como eu vou precisar de uma ideia de chave - valor aonde a chave é o id e o valor é a url longa mongoDB é uma solução adequada e performática pro caso

## Requisitos:

- [x] Cadastro e autenticação de usuários
- [x] URL encurtado para no máximo 6 caracteres
- [x] Qualquer um pode solicitar encurtamento.
- [x] Usuários Autenticados, devem ser vinculados ao encurtamento
- [x] Usuários autenticados devem poder listar, editar o destino, deletar urls deles
- [x] Acessos a URL devem ser contabilizados
- [x] Quando o usuário listar URL's deve conter a contagem de acessos
- [x] Todos registros devem ter createdAt e updatedAt
- [x] Deleções lógicas, chave data de exclusão, se tiver nula está válido
- [x] README ou CONTRIBUTING explicando como rodar o projeto.
- [x] Adicionar aviso caso o usuário encurte sem estar logado
- [x] Adicionar a validação de super admin pra atualizar listar e deletar usuários que não o dele

## Especificações:

- Construir uma estrutura de tabelas que faça sentido para o projeto usando um banco relacional.
- Construir endpoints para autenticação de e-mail e senha que retorna um Bearer Token.
- Construir apenas um endpoint para encurtar o URL, ele deve receber um URL de origem e deve aceitar requisições com e sem autenticação, deve retornar o url encurtado - incluindo o domínio..
- Definir o que deve e não deve ser variável de ambiente..
- Construir endpoints que aceitam apenas requisições autenticadas:
  - Listagem de URL Encurtados pelo usuário com contabilização de clicks
  - Deletar URL Encurtado
  - Atualizar a origem de um URL encurtado.
- Construir um endpoint que ao receber um URL encurtado, redirecione o usuário para o URL de origem e contabilize.
- Maturidade 2 da API REST

## Diferenciais para implementar:

### Importantes:

1. Docker compose ✅
2. Git Tags ✅
3. Configurar pré commit ou pre push hooks. ✅
4. Zod pra validação ✅
5. Swagger (Api Gateway, IAM-service, Url-shortener-service) ✅
6. Separa em micro serviços ✅
7. Código tolerante a falhas. ✅
8. Deploy (Api Gateway, IAM-service, Url-shortener-service) ✅
9. Testes unitários ✅
10. Configurar como serviços separados o IAM do Shortener ✅
11. Deixar no Readme os pontos de melhoria pra escalar horizontalmente ✅

### Se der tempo:

1. Github Actions (Lint e testes automatizados) ✅
2. Lambda/serverless
3. Observabilidade
4. Configurar uma Api Gateway KrankeD ✅
5. Deployments do Kubernetes
6. Construir funcionalidades a mais que acredite ser interessante para o “domínio do negócio” da aplicação.

### Não priorizados:

1. Transformar o sistema em multi tenant.
2. Construir artefatos do Terraform para deploy.
