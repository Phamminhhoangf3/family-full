/* eslint-disable no-unused-vars */
const { StatusCodes } = require('http-status-codes')
const { env } = require('../config/environment')

const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }
  // console.error(responseError)
  if (env.BUILD_MODE !== 'dev') delete responseError.stack
  // console.error(responseError)
  res.status(responseError.statusCode).json(responseError)
}
module.exports = { errorHandlingMiddleware }
