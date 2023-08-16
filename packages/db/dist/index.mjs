// index.ts
import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;
export {
  prisma
};
