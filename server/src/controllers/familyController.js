/* eslint-disable no-console */
const { StatusCodes } = require('http-status-codes')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')
const Joi = require('joi')
const Family = require('../models/familyModel')

const FAMILY_COLLECTION_SCHEMA = Joi.object({
  type: Joi.string().trim().strict().default('family'),
  husband: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  wife: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  exWife: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  children: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null))
    .default([]),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(null),
  _destroy: Joi.boolean().default(false)
})

const validationBeforeCreate = async data => {
  return await FAMILY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

exports.createNew = async (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!'
      })
    }
    const family = new Family({
      type: req.body.type,
      husband: req.body.husband,
      wife: req.body.wife,
      exWife: req.body.exWife,
      children: req.body.children
    })
    const familyValid = await validationBeforeCreate(family)
    if (!familyValid) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Member invalid!'
      })
    }
    Family.create(familyValid, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while creating the family!'
        })
      }
      res.status(StatusCodes.CREATED).json(data)
    })
  } catch (error) {
    next(error)
  }
}

exports.getDetail = async (req, res, next) => {
  try {
    if (!req.body?.id) {
      res.status(400).send({
        message: 'Content can not be empty!'
      })
    }
    Family.findOneById(req.body.id, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while creating the family!'
        })
      } else {
        const dataMap = { ...data?.[0] }
        if (dataMap?.husband?.length) dataMap.husband = dataMap.husband[0]
        if (dataMap?.wife?.length) dataMap.wife = dataMap.wife[0]
        if (dataMap?.exWife?.length) dataMap.exWife = dataMap.exWife[0]
        res.status(StatusCodes.OK).json(dataMap)
      }
    })
  } catch (error) {
    next(error)
  }
}
