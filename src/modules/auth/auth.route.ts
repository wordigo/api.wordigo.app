import { FastifyInstance } from "fastify";
import { Login } from "./auth.controller";
import { LoginSchema } from "./auth.schema";

export default async function (fastify: FastifyInstance) {
  // Login
  fastify.post("/login", { schema: LoginSchema }, Login);
}
