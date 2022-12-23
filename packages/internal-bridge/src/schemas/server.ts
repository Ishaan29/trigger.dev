import { CustomEventSchema, TriggerMetadataSchema } from "@trigger.dev/common-schemas";
import { z } from "zod";

export const ServerRPCSchema = {
  SEND_LOG: {
    request: z.object({
      id: z.string(),
      log: z.object({
        message: z.string(),
        level: z.enum(["DEBUG", "INFO", "WARN", "ERROR"]),
        properties: z.string().optional(),
      }),
    }),
    response: z.boolean(),
  },
  SEND_EVENT: {
    request: z.object({
      id: z.string(),
      event: CustomEventSchema,
    }),
    response: z.boolean(),
  },
  INITIALIZE_HOST: {
    request: z.object({
      apiKey: z.string(),
      workflowId: z.string(),
      workflowName: z.string(),
      trigger: TriggerMetadataSchema,
      packageVersion: z.string(),
      packageName: z.string(),
    }),
    response: z
      .discriminatedUnion("type", [
        z.object({
          type: z.literal("success"),
        }),
        z.object({
          type: z.literal("error"),
          message: z.string(),
        }),
      ])
      .nullable(),
  },
  COMPLETE_WORKFLOW_RUN: {
    request: z.object({
      id: z.string(),
      workflowId: z.string(),
      output: z.string(),
    }),
    response: z.boolean(),
  },
  SEND_WORKFLOW_ERROR: {
    request: z.object({
      id: z.string(),
      workflowId: z.string(),
      error: z.object({
        name: z.string(),
        message: z.string(),
        stackTrace: z.string().optional(),
      }),
    }),
    response: z.boolean(),
  },
};

export type ServerRPC = typeof ServerRPCSchema;
