/* eslint-disable no-console */
const chalk = require('chalk')

const { log } = console
require('dotenv').config()

if (process.env.MODE === 'DEV') {
  console.log(chalk.white('Running in the development mode'))
} else if (process.env.MODE === 'PROD') {
  console.log(chalk.white('Running in the production mode'))
} else {
  console.log(
    chalk.red(
      `MODE=${process.env.MODE} not available. Please, check .env variable`,
    ),
  )
  process.exit(0)
}

log(chalk.gray('Starting proxy'))
require('./proxy')

log(chalk.gray('Starting server'))
require('./chat/index')
// log(chalk.gray("Starting client-static-handler"));
// require("./static-handler");
