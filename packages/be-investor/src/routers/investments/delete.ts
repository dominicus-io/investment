import { investmentsRouter } from "./router";
import client from "@investments/db-repositories";

investmentsRouter.delete("/:investmentId", async (req, res) => {
  const { investmentId } = req.params;
  try {
    await client.$connect();
    await client.investment.delete({
      where: {
        id: investmentId,
      },
    });
    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(404);
  } finally {
    client.$disconnect();
  }
});
