require("dotenv").config();

const proxy = require("express-http-proxy");
const app = require("express")();
const chalk = require("chalk");
const log = console.log;

app.use("/", proxy(`http://localhost:${process.env.EXPRESS_PORT}`));

app.listen(process.env.PROXY_PORT, () => {
  log(chalk.blue.bold(`Proxy is active on port ${process.env.PROXY_PORT}`));
  log(chalk.yellowBright.bold(`Ready to serve http://localhost:${process.env.PROXY_PORT}`));
});
