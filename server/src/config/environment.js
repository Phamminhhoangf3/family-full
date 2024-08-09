// import 'dotenv/config'
require('dotenv/config')

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_DEV_APP_HOST: process.env.APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE
}

module.exports = { env }
