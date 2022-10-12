import { investmentsRouter } from "./router";
import client from "@investments/db-repositories";

investmentsRouter.get("/:investmentId", async (req, res) => {
  await client.$connect();
  const { investmentId } = req.params;
  const investment = await client.investment.findUnique({
    where: {
      id: investmentId,
    },
  });
  client.$disconnect();

  if (!investment) {
    res.sendStatus(404);
  } else {
    res.json(investment);
  }
});
