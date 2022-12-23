import {
  EventRuleSchema,
  TriggerMetadataSchema,
} from "@trigger.dev/common-schemas";
import { z } from "zod";

export type EventRule = z.infer<typeof EventRuleSchema>;

export type TriggerEvent<TSchema extends z.ZodTypeAny> = {
  metadata: z.infer<typeof TriggerMetadataSchema>;
  schema: TSchema;
};

export type TriggerCustomEventOptions<TSchema extends z.ZodTypeAny> = {
  name: string;
  schema: TSchema;
};

export function customEvent<TSchema extends z.ZodTypeAny>(
  options: TriggerCustomEventOptions<TSchema>
): TriggerEvent<TSchema> {
  return {
    metadata: {
      type: "CUSTOM_EVENT",
      service: "trigger",
      name: options.name,
      rule: { name: [options.name] },
    },
    schema: options.schema,
  };
}
