const express = require('express')
const { StatusCodes } = require('http-status-codes')
const { memberValidation } = require('../../validations/memberValidation')
const memberController = require('../../controllers/memberController')

module.exports = app => {
  const Router = express.Router()

  Router.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Status API members' })
  })
  Router.get('/list', memberController.getList)
  Router.post('/create', memberValidation.createNew, memberController.createNew)

  app.use('/api/members', Router)
}
