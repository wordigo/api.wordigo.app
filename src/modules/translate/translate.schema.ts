import { JSONSchema } from "json-schema-to-ts";

export const TranslationValidationBody = {
  type: "object",
  properties: {
    sourceLanguage: {
      type: "string",
      default: "en",
    },
    targetLanguage: {
      type: "string",
      default: "tr",
    },
    query: {
      type: "string",
      default: "Hello World",
    },
  },
  required: ["query", "targetLanguage", "sourceLanguage"],
} as const satisfies JSONSchema;

export const TranslationValidation = {
  body: TranslationValidationBody,
  tags: ["translate"],
  description: "Translate request endpoint",
  response: {
    404: { $ref: "messageResponseSchema#" },
  },
};
