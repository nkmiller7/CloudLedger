import express from "express";
import config from "./config.js";

const backend = express();
backend.listen(config.express.port, () => {});
