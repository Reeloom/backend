# AI Module

## Overview

This module provides AI-powered features, such as content generation and analytics. It is structured according to DDD, Clean, and Hexagonal architecture principles.

## Structure

- `domain/`: Entities, value objects, and repository interfaces for AI features.
- `application/`: Use cases for AI operations.
- `infrastructure/`: Controllers, repositories, and routes for AI endpoints.

## Flow Example

1. HTTP request hits the AI route (e.g., `/api/v1/ai`).
2. Controller parses the request and calls the appropriate use case.
3. Use case orchestrates domain logic and interacts with repositories.
4. Response is returned to the client.
