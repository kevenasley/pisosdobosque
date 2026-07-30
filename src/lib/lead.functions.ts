import { createServerFn } from "@tanstack/react-start";
import { parseLead, processLead } from "./lead.server";
import type { LeadResult } from "./lead.server";

export type { LeadResult } from "./lead.server";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(parseLead)
  .handler(async ({ data }): Promise<LeadResult> => processLead(data));

