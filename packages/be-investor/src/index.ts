import Express from "express";
import { investmentsRouter } from "./routers";

const app = Express();
const port = 3001;

app.use(Express.json())
app.use("/api/investments", investmentsRouter)

app.listen(port, () => {
  console.log(`The application is running and listening on port ${port}`);
});