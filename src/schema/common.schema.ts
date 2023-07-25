/*
 * Simple global schemas that are going to be used across all of our app.
 *
 * See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
 */

import { JSONSchema } from "json-schema-to-ts";

export const paginationSchemav2 = {
  type: "object",
  properties: {
    take: {
      type: "number",
      enum: [5, 10, 25],
      default: 10,
    },
    from: {
      type: "string",
      pattern: "^[0-9a-fA-F]{24}$",
    },
  },
} as const satisfies JSONSchema;

// Cursor Pagination: take and from values.
// - from must match the MongoDB document id pattern
export const paginationSchema = {
  $id: "paginationSchema",
  type: "object",
  properties: {
    take: {
      type: "number",
      enum: [5, 10, 25],
      default: 10,
    },
    from: {
      type: "string",
      pattern: "^[0-9a-fA-F]{24}$",
    },
  },
} as const satisfies JSONSchema;

// Just a single response object including a message
export const messageSchema = {
  $id: "messageResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

// Used to validate/match URLS that include an ':id' param
export const paramIdSchema = {
  $id: "paramIdSchema",
  type: "object",
  properties: {
    id: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
  },
  required: ["id"],
};
