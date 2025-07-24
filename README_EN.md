<p style="align:center">
  <a href="./README_EN.md">English</a> | <a href=".">Português </a>
</p>

# URL Shortener Project

This is a URL shortener project built with a microservices architecture using NestJS and KrakenD as an API Gateway.

## Project Structure

The project consists of three main components:

- **url-shortener-service**: Responsible for URL shortening and redirection
- **iam-service**: Identity and Access Management service for authentication and authorization
- **krakend**: API Gateway that manages routing and communication between services

## Architecture

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

## Prerequisites

- Node.js (version 18 or higher)
- Docker
- Docker Compose
- npm (version 8 or higher)

## Installation and Configuration

Follow the steps below to set up the development environment:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shorten-url
   ```

2. **Configure environment variables**

  Each service has an `.env.example` file with the necessary variables. Copy these files to `.env` in their respective directories and adjust the values as needed:

   ```bash
   # To root
   cp .env.example .env

   # To url-shortener-service
   cp services/url-shortener-service/.env.example services/url-shortener-service/.env

   # To iam-service
   cp services/iam-service/.env.example services/iam-service/.env
   ```

   Content of `.env.example`:

   ```env
   # URL that will be used for the gateway to identify where to direct IAM requests
   IAM_SERVICE_URL="http://iam-service:3001"
   # URL that will be used for the gateway to identify where to direct URL requests
   URL_SHORTENER_SERVICE_URL="http://url-shortener-service:3000"

   # Credentials that will be used to create the postgres container
   DB_USER=
   DB_PASS=
   DB_NAME=
   DB_PORT=
   ```

   Contents of `url-shortener-service/.env.example`:

   ```env
   # Shortener base URL will be used to return the full shortened URL, facilitating access
   SHORTENER_BASE_URL=http://localhost:8080
   DATABASE_URL="postgresql://user:password@host:port/databaseName?schema=public"

   # ⚠️⚠️ JWT secrets must be the same between the 2 services to validate the token in both
   JWT_SECRET=
   JWT_REFRESH_SECRET=
   ```

   Contents of `iam-service/.env.example`:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/databaseName?schema=public"

   # ⚠️⚠️ JWT secrets must be the same between the 2 services to validate the token in both
   JWT_SECRET=
   JWT_REFRESH_SECRET=
   ```

3. **Install all dependencies**

   ```bash
   npm run install:all
   ```

   This command will install dependencies for the root project and all services.

4. **Start services with Docker**

   ```bash
   npm run docker:up
   ```

   This command will:

   - Build Docker images for all services
   - Start the containers (including the KrakenD API Gateway)
   - Automatically run database migrations
   - Start logs for the URL shortener service

5. **Accessing the Services**

   After starting the containers, services will be available through the KrakenD API Gateway:

   - API Gateway: http://localhost:8080
   - Endpoints of Authentication: http://localhost:8080/api/auth/\*
   - Endpoints of URLs: http://localhost:8080/api/urls/\*
     
6. **To stop the services**

   ```bash
   npm run docker:down
   ```

## Documentation

API Gateway documentation is available at: https://shorten-urlgateway-service.up.railway.app/api-gateway/docs

URL Shortener Service documentation is available at: https://url-shortener-service.up.railway.app/docs

IAM Service documentation is available at: https://iam-service.up.railway.app/docs

## Services

### URL Shortener Service

Service responsible for:

- Shortening long URLs
- Redirecting short URLs to original ones
- Managing access statistics

### IAM Service

Service responsible for:

- User authentication
- Permission management
- Access control

### KrakenD API Gateway

Service responsible for:

- Routing requests to appropriate services
- Exposing a single port for service access

## Development

For local development, after installing dependencies, you can:

1. Use the Docker environment (recommended):

   ```bash
   npm run docker:up
   ```

2. Monitore logs:
   ```bash
   npm run logs
   ```

## What will be needed for horizontal scaling

To ensure the system can scale horizontally efficiently, some important points need to be considered:

- **Distributed Cache Implementation**:

  - Use Redis to share cache between instances
  - Implement caching for frequently accessed URLs
  - Configure efficient cache invalidation strategies
  - Use cache to reduce database load

- **Stateless Architecture**:

  - Ensure no state information is stored locally on instances
  - Move all sessions to distributed storage
  - Maintain a stateless architecture

- **Node.js Optimization**:
  - Configure Node.js in cluster mode to leverage multiple cores
  - Implement worker threads for CPU-intensive operations
  - Monitor and adjust the garbage collector

- **Load Balancer Implementation**:
  - Use a load balancer to distribute traffic among instances

- **Rate Limiting**:
  - Implement rate limiting to protect the system against brute-force attacks and resource abuse
  - API Gateway is already created; just configure rate limiting in the KrakenD configuration file

- **Observability Implementation**:

  - Implement distributed logging
  - Implement metrics monitoring
  - Implement distributed tracing
  - All with the intention of identifying failure points and improving system availability

- **Migration to Fastify**:
  - Replace Express with Fastify as the HTTP framework
  - Take advantage of Fastify's faster JSON parsing
  - Utilize Fastify's native validation system
  - Benefit from lower overhead per request
    
## License

This project is licensed under the [MIT License](LICENSE).
