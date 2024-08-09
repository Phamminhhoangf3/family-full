// import { MongoClient, ServerApiVersion } from 'mongodb'
// import { env } from './environment'
const { MongoClient, ServerApiVersion } = require('mongodb')
const { env } = require('./environment')

let trelloDataBaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  trelloDataBaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

const GET_DB = () => {
  if (!trelloDataBaseInstance) throw new Error('Must connect to Database first!')
  return trelloDataBaseInstance
}

module.exports = { CONNECT_DB, CLOSE_DB, GET_DB }
