const express = require("express");
const { Nuxt, Builder } = require("nuxt");
require("dotenv").config();

const config = require("../nuxt.config.js");
const useMiddlewares = require("./middlewares");
const useRoutes = require("./routes");
const { connectDb } = require("./config");
const consts = require("./utils/consts");
const { getEnvironmentVariable } = require("./utils/helpers.js");

// Start nuxt.js
async function start() {
  await connectDb();
  const { HOST, PORT, API } = consts;
  config.dev = !(process.env.NODE_ENV === "production");
  const nuxt = new Nuxt(config);
  // Build only in dev mode
  if (config.dev && +getEnvironmentVariable("BUILD_NUXT_ON_DEV"))
    await new Builder(nuxt).build();

  const app = express();
  useMiddlewares(app);
  useRoutes(app);

  app.use(async (req, res, next) => {
    req.subapp = req.url.split("/")[1];
    if (req.subapp !== API) {
      res.status(200);
      await new Promise((resolve, reject) => {
        nuxt.render(req, res, err => (err ? reject(err) : resolve()));
      });
    } else {
      next();
    }
  });

  app.use(nuxt.render);

  // centerlize errors
  app.use((error, req, res, next) => {
    console.log(error.message);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
  });

  //conect to db
  app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log("\n" + " OPEN " + ` http://${HOST}:${PORT}\n`);
}

start();
