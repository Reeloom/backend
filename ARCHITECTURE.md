# TargUp Backend Architecture

## Overview

This architecture was redesigned following the principles of **Domain-Driven Design (DDD)**, **Clean Architecture**, and **Hexagonal Architecture** to support project growth and multiple teams.

## Directory Structure

```
src/
├── shared/                          # Code shared between modules
│   ├── domain/                      # Shared domain concepts
│   │   ├── entities/                # Base entities
│   │   ├── value-objects/           # Base value objects
│   │   ├── repositories/            # Repository interfaces
│   │   └── events/                  # Domain events
│   ├── application/                 # Shared use cases
│   │   ├── use-cases/               # Use case interfaces
│   │   └── dto/                     # Base DTOs
│   └── infrastructure/              # Shared infrastructure
│       ├── database/                # Base repositories
│       ├── http/                    # Base controllers
│       └── di/                      # Dependency injection
├── modules/                         # Domain modules
│   ├── user/                        # User module
│   │   ├── domain/                  # Business rules
│   │   │   ├── entities/            # Domain entities
│   │   │   ├── value-objects/       # Value objects
│   │   │   └── repositories/        # Repository interfaces
│   │   ├── application/             # Use cases
│   │   │   └── use-cases/           # Use case implementations
│   │   └── infrastructure/          # Technical implementations
│   │       ├── controllers/         # HTTP controllers
│   │       ├── repositories/        # Data repositories
│   │       └── routes/              # HTTP routes
│   ├── auth/                        # Authentication module
│   ├── content/                     # Content module
│   ├── analytics/                   # Analytics module
│   └── ...                         # Other modules
├── config/                          # Configurations
├── database/                        # Database configuration
└── server.ts                        # Entry point
```

## Architectural Principles

### 1. Domain-Driven Design (DDD)

- **Entities**: Objects with unique identity
- **Value Objects**: Immutable objects without identity
- **Repositories**: Abstraction for persistence
- **Domain Services**: Complex business logic

### 2. Clean Architecture

- **Framework Independence**: The domain does not depend on frameworks
- **Testability**: Easy to test each layer in isolation
- **UI Independence**: Business logic does not depend on the interface
- **Database Independence**: The domain does not know persistence details

### 3. Hexagonal Architecture (Ports & Adapters)

- **Ports**: Interfaces that define contracts
- **Adapters**: Concrete implementations
- **Dependency Inversion**: Dependencies point to abstractions

## Application Layers

### 1. Domain Layer

- **Responsibility**: Business rules and domain logic
- **Dependencies**: No external dependencies
- **Components**: Entities, Value Objects, Repositories (interfaces)

### 2. Application Layer

- **Responsibility**: Use case orchestration
- **Dependencies**: Domain Layer
- **Components**: Use Cases, DTOs, Event Handlers

### 3. Infrastructure Layer

- **Responsibility**: Technical implementations
- **Dependencies**: Domain and Application Layers
- **Components**: Controllers, Repositories, External Services

## Design Patterns

### 1. Repository Pattern

```typescript
// Interface (Domain)
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

// Implementation (Infrastructure)
class PrismaUserRepository implements IUserRepository {
  // Implementation using Prisma
}
```

### 2. Use Case Pattern

```typescript
// Interface
interface ICommand<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

// Implementation
class CreateUserUseCase
  implements ICommand<CreateUserRequest, CreateUserResponse>
{
  constructor(private userRepository: IUserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Use case logic
  }
}
```

### 3. Controller Pattern

```typescript
class CreateUserController extends BaseController<
  CreateUserRequest,
  CreateUserResponse
> {
  constructor(useCase: CreateUserUseCase) {
    super(useCase);
  }

  protected buildRequest(req: Request): CreateUserRequest {
    return new CreateUserRequest(req.body.email, req.body.password);
  }
}
```

## Benefits of the New Architecture

### 1. Scalability

- **Independent Modules**: Each module can be developed by different teams
- **Low Coupling**: Changes in one module do not affect others
- **High Cohesion**: Related functionalities are grouped together

### 2. Maintainability

- **Organized Code**: Clear and predictable structure
- **Separated Responsibilities**: Each class has a specific responsibility
- **Easy Navigation**: Intuitive directory structure

### 3. Testability

- **Unit Tests**: Easy to test each component in isolation
- **Simple Mocks**: Interfaces facilitate mock creation
- **Integration Tests**: Clear structure for integration tests

### 4. Flexibility

- **Technology Swap**: Easy to change implementations without affecting the domain
- **New Adapters**: Add new adapters without modifying the core
- **Configuration**: Different configurations for different environments

## Naming Conventions

### 1. Entities

- Singular name: `User`, `Product`, `Order`
- Interface suffix: `IUserRepository`

### 2. Value Objects

- Descriptive name: `Email`, `Password`, `UserId`
- Immutable and without identity

### 3. Use Cases

- Verb + Noun: `CreateUser`, `UpdateProduct`, `DeleteOrder`
- Suffix: `CreateUserUseCase`

### 4. Controllers

- Verb + Noun + Controller: `CreateUserController`
- Responsible only for HTTP

### 5. Repositories

- Entity name + Repository: `UserRepository`
- Implementations with technology prefix: `PrismaUserRepository`

## Example of a Complete Flow

### 1. HTTP Request

```
POST /api/users
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### 2. Controller

```typescript
CreateUserController.handle(req, res)
  ↓
buildRequest(req) → CreateUserRequest
  ↓
useCase.execute(request)
```

### 3. Use Case

```typescript
CreateUserUseCase.execute(request)
  ↓
Email.create(request.email)
Password.create(request.password)
  ↓
User.create(props)
  ↓
userRepository.save(user)
```

### 4. Repository

```typescript
PrismaUserRepository.save(user)
  ↓
prisma.user.create(data)
  ↓
User.createFromPersistence(...)
```

### 5. Response

```typescript
CreateUserResponse
  ↓
res.status(201).json(response)
```

## Next Steps

1. **Implement Remaining Modules**: Auth, Content, Analytics
2. **Add Validations**: Joi or class-validator
3. **Implement Events**: Event sourcing for auditing
4. **Add Cache**: Redis for performance
5. **Implement Logs**: Winston or Pino
6. **Add Metrics**: Prometheus
7. **Implement Health Checks**: Health endpoints
8. **Add Documentation**: Swagger/OpenAPI

## Considerations for Multiple Teams

### 1. API Contracts

- **OpenAPI/Swagger**: Clear API documentation
- **Versioning**: API versioning
- **Contracts First**: Define contracts before implementation

### 2. Continuous Integration

- **Automated Tests**: CI/CD with tests
- **Code Review**: Mandatory code review
- **Code Standards**: ESLint, Prettier

### 3. Monitoring

- **Centralized Logs**: ELK Stack
- **Metrics**: Prometheus + Grafana
- **Tracing**: Jaeger or Zipkin

### 4. Communication

- **Documentation**: README per module
- **Meetings**: Sync between teams
- **Technical Decisions**: ADRs (Architecture Decision Records)
