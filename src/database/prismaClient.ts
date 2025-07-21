import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends(withAccelerate());

export type PrismaExtendedClient = typeof prisma;
export default prisma;
