import { investmentsRouter } from "./router";
import client from "@investments/db-repositories";
import { z, ZodError } from "zod";

import { dateSchema } from "../../utils";

const UpdateInvestment = z.object({
  name: z.string().optional(),
  return: z.number().optional(),
  fundingCapital: z.number().optional(),
  investmentTerm: z.number().optional(),
  fundingEnd: dateSchema.optional(),
});

investmentsRouter.patch("/:investmentId", async (req, res) => {
  const { investmentId } = req.params;
  try {
    await client.$connect();
    const find = await client.investment.findUnique({
      where: {
        id: investmentId,
      },
    });
    if (!find) {
      res.sendStatus(404);
    } else {
      const parsedInvestment = UpdateInvestment.parse(req.body);
      client.investment.update({
        where: {
          id: investmentId,
        },
        data: parsedInvestment,
      });

      res.sendStatus(204)
    }
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json(e.issues);
    } else {
      res.sendStatus(500);
    }
  } finally {
    client.$disconnect();
  }
});
