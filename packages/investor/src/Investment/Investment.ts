import { z } from "zod";

import { dateSchema } from "../utils";

export const InvestmentSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    return: z.number(),
    fundingCapital: z.number(),
    investmentTerm: z.number(),
    fundingEnd: dateSchema,
  })
  .transform((el) => ({
    ...el,
    status: el.fundingEnd > new Date() ? "active" : "closed",
  }));

export type Investment = z.TypeOf<typeof InvestmentSchema>