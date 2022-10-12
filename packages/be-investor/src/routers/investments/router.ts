import Express from "express";

const investmentsRouter = Express.Router();

investmentsRouter.use((req, _, next) => {
  console.log("--------------------------");
  console.log(`URL: ${req.url}`);
  console.log(`HTTP Method: ${req.method}`);
  Object.keys(req.body).length && console.log(`Body:\n ${JSON.stringify(req.body)}`);
  console.log("--------------------------\n");
  next();
});

export { investmentsRouter };
