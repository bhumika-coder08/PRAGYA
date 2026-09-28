import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

declare global {
  // eslint-disable-next-line no-var
  var __pragya_prisma__: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[PRAGYA DB] DATABASE_URL is not configured in environment.');
}

const adapter = new PrismaPg({
  connectionString: connectionString || '',
});

export const prisma = global.__pragya_prisma__ ?? new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__pragya_prisma__ = prisma;
}
