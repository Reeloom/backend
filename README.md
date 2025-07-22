# TargUp Backend

## Rodando Backend e Banco Separados

### Subir apenas o banco de dados

```sh
docker compose -f docker-compose.db.yml up -d
```

### Subir apenas o backend (após o banco estar rodando)

```sh
docker compose -f docker-compose.backend.yml up --build
```

### Parar um serviço

```sh
docker compose -f docker-compose.backend.yml down
# ou
docker compose -f docker-compose.db.yml down
```

### Atualizar containers (rebuild)

```sh
docker compose -f docker-compose.backend.yml up --build -d
```

### Subir ambos juntos (modo antigo/all-in-one)

```sh
docker compose up --build
```

---

## Comandos rápidos (adicione no package.json ou use como alias)

- Subir ambos:
  ```sh
  docker compose -f docker-compose.db.yml up -d && docker compose -f docker-compose.backend.yml up --build -d
  ```
- Parar ambos:
  ```sh
  docker compose -f docker-compose.backend.yml down && docker compose -f docker-compose.db.yml down
  ```
- Atualizar backend:
  ```sh
  docker compose -f docker-compose.backend.yml up --build -d
  ```
- Atualizar banco:
  ```sh
  docker compose -f docker-compose.db.yml up --build -d
  ```

---

## Observações

- O backend espera que o banco esteja disponível em `localhost:5432`.
- Para produção, ajuste as variáveis de ambiente conforme necessário.
- O volume `pgdata` garante persistência dos dados do Postgres.

---

## Prerequisites

- [pnpm](https://pnpm.io/) (Install with `npm install -g pnpm`
