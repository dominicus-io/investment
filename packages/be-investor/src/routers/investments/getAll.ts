import { investmentsRouter } from "./router";
import client from "@investments/db-repositories";

investmentsRouter.get("/", async (_, res) => {
    await client.$connect()
    const list = await client.investment.findMany()
    client.$disconnect()
    
    res.json(list)
});
