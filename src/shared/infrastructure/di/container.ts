import { PrismaUserRepository } from '@/modules/user/infrastructure/repositories/PrismaUserRepository';
import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user/CreateUserUseCase';
import { CreateUserController } from '@/modules/user/infrastructure/controllers/CreateUserController';
import prisma from '@/database/prismaClient';

// User Module Dependencies
export const userRepository = new PrismaUserRepository(prisma);
export const createUserUseCase = new CreateUserUseCase(userRepository);
export const createUserController = new CreateUserController(createUserUseCase);
