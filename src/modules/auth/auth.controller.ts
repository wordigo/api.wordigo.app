import { FastifyReply, FastifyRequest } from "fastify";
import { LoginSchema } from "./auth.schema";
import { FromSchema } from "json-schema-to-ts";

type LoginSchemaType = FromSchema<typeof LoginSchema>;

export async function Login(request: FastifyRequest<{ Body: LoginSchemaType }>, reply: FastifyReply) {
  return reply.status(200).send("Hello World");
}

export async function GetUserMe(request: FastifyRequest<{ Body: LoginSchemaType }>, reply: FastifyReply) {
  return reply.status(200).send("Usser Values");
}
