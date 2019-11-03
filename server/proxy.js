require("dotenv").config();

const proxy = require("express-http-proxy");
const app = require("express")();
const chalk = require("chalk");
const log = console.log;

app.use("/", proxy(`http://localhost:${process.env.EXPRESS_PORT}`));

app.listen(80, () => log(chalk.blue.bold("Proxy is active")));
