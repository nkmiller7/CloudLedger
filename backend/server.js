import express from "express";
import session from "express-session";
import config from "./config.js";
import initialize_routes from "./api/index.js";

const backend = express();

backend.use(express.json());
backend.use(
  session({
    name: "CloudLedger",
    secret: config.express.session_secret,
    resave: false,
    saveUninitialized: true,
  })
);
initialize_routes(backend);

backend.listen(config.express.port, () => {});
