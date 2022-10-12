import { investmentsRouter } from "./router";
import client from "@investments/db-repositories";
import { z, ZodError } from "zod";

import { dateSchema } from "../../utils";

const CreateInvestment = z.object({
  name: z.string(),
  return: z.number(),
  fundingCapital: z.number().int(),
  investmentTerm: z.number().int(),
  fundingEnd: dateSchema
});

investmentsRouter.post("/", async (req, res) => {
  try {
    await client.$connect();
    const parsedInvestment = CreateInvestment.parse(req.body);
    const investment = await client.investment.create({
      data: parsedInvestment,
    });

    res.json(investment);
  } catch (e) {
    console.log(e)
    if (e instanceof ZodError) {
      res.status(400).json(e.issues);
    } else {
      res.sendStatus(500);
    }
  } finally {
    client.$disconnect();
  }
});
