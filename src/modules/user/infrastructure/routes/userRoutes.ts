import { Router } from 'express';
import { CreateUserController } from '@/modules/user/infrastructure/controllers/CreateUserController';
import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user/CreateUserUseCase';
import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/PrismaUserRepository';
import prisma from '@/database/prismaClient';

const router = Router();

// Dependency injection
const userRepository = new PrismaUserRepository(prisma);
const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);

// Routes
router.post('/', (req, res) => createUserController.handle(req, res));

export default router;
