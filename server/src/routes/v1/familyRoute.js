const express = require('express')
const { StatusCodes } = require('http-status-codes')
const familyValidation = require('../../validations/familyValidation')
const familyController = require('../../controllers/familyController')

module.exports = app => {
  const Router = express.Router()

  Router.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Status API families' })
  })
  Router.post('/create', familyValidation.createNew, familyController.createNew)
  Router.get('/detail/:id', familyController.getDetail)

  app.use('/api/families', Router)
}
