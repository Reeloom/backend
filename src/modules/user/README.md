# User Module

## Overview

This module handles all user-related business logic, including user creation, authentication, and management. It follows DDD, Clean, and Hexagonal architecture principles.

## Structure

- `domain/`: Entities, value objects, and repository interfaces for users.
- `application/`: Use cases for user operations.
- `infrastructure/`: Controllers, repositories, and routes for user endpoints.

## Flow Example

1. HTTP request hits the user route (e.g., `/api/v1/users`).
2. Controller parses the request and calls the appropriate use case.
3. Use case orchestrates domain logic and interacts with repositories.
4. Response is returned to the client.
