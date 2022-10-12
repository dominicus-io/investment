import { z } from "zod";

import { InvestmentSchema } from "./Investment";

export const InvestmentsSchema = z.array(InvestmentSchema);

export type Investments = z.TypeOf<typeof InvestmentsSchema>;
