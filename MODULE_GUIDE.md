# Guide for Implementing New Modules

This guide shows how to implement new modules following the established architecture.

## Prerequisites

- [pnpm](https://pnpm.io/) (Install with `npm install -g pnpm` if you don't have it)

## Structure of a Module

```
src/modules/[module-name]/
├── domain/                          # Business rules
│   ├── entities/                    # Domain entities
│   ├── value-objects/               # Value objects
│   ├── repositories/                # Repository interfaces
│   └── events/                      # Domain events
├── application/                     # Use cases
│   └── use-cases/                   # Use case implementations
│       ├── [action]-[entity]/       # Ex: create-user, update-product
│       │   ├── [Action][Entity]UseCase.ts
│       │   ├── [Action][Entity]Request.ts
│       │   └── [Action][Entity]Response.ts
│       └── ...
└── infrastructure/                  # Technical implementations
    ├── controllers/                 # HTTP controllers
    ├── repositories/                # Data repositories
    └── routes/                      # HTTP routes
```

## Installing Dependencies

```sh
pnpm install
```

## Running Scripts

Use `pnpm run <script>` for all scripts (e.g., `pnpm run build`, `pnpm run test`).

## Step by Step: Creating a Module

### 1. Define the Domain

#### 1.1 Value Objects

```typescript
// src/modules/product/domain/value-objects/ProductId.ts
import { ValueObject } from '../../../../shared/domain/value-objects/ValueObject';
import { v4 as uuidv4 } from 'uuid';

interface ProductIdProps {
  value: string;
}

export class ProductId extends ValueObject<ProductIdProps> {
  private constructor(props: ProductIdProps) {
    super(props);
  }
  public static create(id: string): ProductId {
    if (!this.isValidUuid(id)) {
      throw new Error('Invalid UUID format');
    }
    return new ProductId({ value: id });
  }
  public static generate(): ProductId {
    return new ProductId({ value: uuidv4() });
  }
  get value(): string {
    return this.props.value;
  }
  private static isValidUuid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
```

#### 1.2 Entities

```typescript
// src/modules/product/domain/entities/Product.ts
import { BaseEntity } from '../../../../shared/domain/entities/BaseEntity';
import { ProductId } from '../value-objects/ProductId';
import { ProductName } from '../value-objects/ProductName';
import { Price } from '../value-objects/Price';

export interface ProductProps {
  name: ProductName;
  price: Price;
  description?: string;
  isActive?: boolean;
}

export class Product extends BaseEntity<ProductProps> {
  private constructor(
    props: ProductProps,
    id?: ProductId,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id?.value, createdAt, updatedAt);
  }
  public static create(props: ProductProps, id?: ProductId): Product {
    return new Product(props, id);
  }
  public static createFromPersistence(
    props: ProductProps,
    id: string,
    createdAt: Date,
    updatedAt: Date,
  ): Product {
    return new Product(props, ProductId.create(id), createdAt, updatedAt);
  }
  get name(): ProductName {
    return this.props.name;
  }
  get price(): Price {
    return this.props.price;
  }
  get description(): string | undefined {
    return this.props.description;
  }
  get isActive(): boolean {
    return this.props.isActive ?? true;
  }
  public activate(): void {
    this.props.isActive = true;
  }
  public deactivate(): void {
    this.props.isActive = false;
  }
  public updatePrice(newPrice: Price): void {
    this.props.price = newPrice;
  }
  public updateName(newName: ProductName): void {
    this.props.name = newName;
  }
  protected generateId(): string {
    return ProductId.generate().value;
  }
}
```

#### 1.3 Repository (Interface)

```typescript
// src/modules/product/domain/repositories/IProductRepository.ts
import { IRepository } from '../../../../shared/domain/repositories/IRepository';
import { Product } from '../entities/Product';
import { ProductName } from '../value-objects/ProductName';

export interface IProductRepository extends IRepository<Product> {
  findByName(name: ProductName): Promise<Product | null>;
  findActiveProducts(): Promise<Product[]>;
  exists(name: ProductName): Promise<boolean>;
}
```

### 2. Implement Use Cases

#### 2.1 Request DTO

```typescript
// src/modules/product/application/use-cases/create-product/CreateProductRequest.ts
import { BaseDTO } from '../../../../../shared/application/dto/BaseDTO';

export class CreateProductRequest extends BaseDTO {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly description?: string,
  ) {
    super();
  }
  validate(): boolean {
    return !!(this.name && this.price > 0 && this.name.length > 0);
  }
}
```

#### 2.2 Response DTO

```typescript
// src/modules/product/application/use-cases/create-product/CreateProductResponse.ts
export interface CreateProductResponse {
  id: string;
  name: string;
  price: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}
```

#### 2.3 Use Case

```typescript
// src/modules/product/application/use-cases/create-product/CreateProductUseCase.ts
import { ICommand } from '../../../../../shared/application/use-cases/IUseCase';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductName } from '../../domain/value-objects/ProductName';
import { Price } from '../../domain/value-objects/Price';
import { CreateProductRequest } from './CreateProductRequest';
import { CreateProductResponse } from './CreateProductResponse';

export class CreateProductUseCase
  implements ICommand<CreateProductRequest, CreateProductResponse>
{
  constructor(private productRepository: IProductRepository) {}
  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    const name = ProductName.create(request.name);
    const price = Price.create(request.price);
    // Check if the product already exists
    const existingProduct = await this.productRepository.findByName(name);
    if (existingProduct) {
      throw new Error('Product already exists with this name');
    }
    // Create the product
    const product = Product.create({
      name,
      price,
      description: request.description,
      isActive: true,
    });
    // Save to repository
    const savedProduct = await this.productRepository.save(product);
    return {
      id: savedProduct.id,
      name: savedProduct.name.value,
      price: savedProduct.price.value,
      description: savedProduct.description,
      isActive: savedProduct.isActive,
      createdAt: savedProduct.createdAt,
    };
  }
}
```

### 3. Implement Infrastructure

#### 3.1 Repository (Implementation)

```typescript
// src/modules/product/infrastructure/repositories/InMemoryProductRepository.ts
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductName } from '../../domain/value-objects/ProductName';
import { Price } from '../../domain/value-objects/Price';

export class InMemoryProductRepository implements IProductRepository {
  // Implement methods using in-memory storage or any DB client
}
```

#### 3.2 Controller

```typescript
// src/modules/product/infrastructure/controllers/CreateProductController.ts
import { Request, Response } from 'express';
import { BaseController } from '../../../../shared/infrastructure/http/BaseController';
import { CreateProductUseCase } from '../../application/use-cases/create-product/CreateProductUseCase';
import { CreateProductRequest } from '../../application/use-cases/create-product/CreateProductRequest';
import { CreateProductResponse } from '../../application/use-cases/create-product/CreateProductResponse';

export class CreateProductController extends BaseController<
  CreateProductRequest,
  CreateProductResponse
> {
  constructor(useCase: CreateProductUseCase) {
    super(useCase);
  }
  protected buildRequest(req: Request): CreateProductRequest {
    return new CreateProductRequest(
      req.body.name,
      req.body.price,
      req.body.description,
    );
  }
  protected sendResponse(res: Response, response: CreateProductResponse): void {
    res.status(201).json({
      success: true,
      data: response,
    });
  }
}
```

#### 3.3 Routes

```typescript
// src/modules/product/infrastructure/routes/productRoutes.ts
import { Router } from 'express';
import { CreateProductController } from '../controllers/CreateProductController';
import { CreateProductUseCase } from '../../application/use-cases/create-product/CreateProductUseCase';
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository';

const router = Router();

// Dependency injection
const productRepository = new InMemoryProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const createProductController = new CreateProductController(
  createProductUseCase,
);

// Routes
router.post('/', (req, res) => createProductController.handle(req, res));

export default router;
```

### 4. Register the Module

#### 4.1 Update the route registry

```typescript
// src/core/plugins/registerRoute.ts
import { Router } from 'express';
import authRoutes from '../../modules/auth/routes';
import userRoutes from '../../modules/user/infrastructure/routes/userRoutes';
import productRoutes from '../../modules/product/infrastructure/routes/productRoutes';

export function registerRoutes(app: Router) {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  // Add other domains here
}
```

#### 4.2 Update the DI container

```typescript
// src/shared/infrastructure/di/container.ts
import { InMemoryProductRepository } from '../../../modules/product/infrastructure/repositories/InMemoryProductRepository';
import { CreateProductUseCase } from '../../../modules/product/application/use-cases/create-product/CreateProductUseCase';
import { CreateProductController } from '../../../modules/product/infrastructure/controllers/CreateProductController';

// Product Module Dependencies
export const productRepository = new InMemoryProductRepository();
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const createProductController = new CreateProductController(
  createProductUseCase,
);
```

### 5. Tests

- Unit tests for value objects and entities
- Integration tests for use cases
- API tests for controllers

## Checklist for New Modules

- [ ] Define value objects
- [ ] Create entities
- [ ] Define repository interfaces
- [ ] Implement use cases
- [ ] Create DTOs (Request/Response)
- [ ] Implement repositories
- [ ] Create controllers
- [ ] Define routes
- [ ] Register in the route system
- [ ] Update DI container
- [ ] Write tests
- [ ] Document API
- [ ] Update architecture documentation
