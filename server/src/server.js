/* eslint-disable no-console */
const express = require('express')
const exitHook = require('async-exit-hook')
const cors = require('cors')
const { CLOSE_DB, CONNECT_DB } = require('./config/mongodb')
const { env } = require('./config/environment')
const { errorHandlingMiddleware } = require('./middlewares/errorHandlingMiddleware')
const corsOptions = require('./config/cors')

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  app.use(express.json())

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to family application!' })
  })

  require('./routes/v1/memberRoute')(app)
  require('./routes/v1/familyRoute')(app)

  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`Production port:${process.env.PORT}`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local dev: ${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }

  exitHook(() => {
    CLOSE_DB()
    console.log('exit done!')
  })
}

;(async () => {
  try {
    await CONNECT_DB()
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
