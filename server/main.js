const chalk = require("chalk");
const log = console.log;

log(chalk.gray('Starting proxy'))
require("./proxy")
log(chalk.gray('Starting chat'))
require("./chat")