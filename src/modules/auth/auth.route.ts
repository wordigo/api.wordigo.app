import { FastifyInstance } from "fastify";
import { GetUserMe, Login } from "./auth.controller";
import fastifyPassport from "@fastify/passport";

export const fastifyPreValidationJwt: any = {
  preValidation: fastifyPassport.authenticate("jwt", { session: false }),
};

export default async function (fastify: FastifyInstance) {
  // Get User Me
  fastify.get("/getUserMe", fastifyPreValidationJwt, GetUserMe);

  // Login
  fastify.post("/login", Login);
}
