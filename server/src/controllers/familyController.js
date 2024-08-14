/* eslint-disable no-console */
const { StatusCodes } = require('http-status-codes')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')
const Joi = require('joi')
const Family = require('../models/familyModel')
const { Member } = require('../models/memberModel')

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
    if (!req.params?.id) {
      res.status(400).send({
        message: 'Content can not be empty!'
      })
    }
    Family.findOneById(req.params?.id, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while creating the family!'
        })
      } else {
        const dataMap = {
          ...data?.[0]
        }
        dataMap.husband = Member.convertToHusband(dataMap.husband[0])
        dataMap.wife = Member.convertToWife(dataMap.wife[0])
        dataMap.exWife = Member.convertToExWife(dataMap.exWife[0])
        dataMap.children = Member.convertToChild(
          dataMap.children.map(child => ({ ...child, dadId: dataMap.husband?._id }))
        )
        res.status(StatusCodes.OK).json(dataMap)
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.getList = async (req, res, next) => {
  try {
    const listId = req.body?.ids
    if (!listId) {
      res.status(400).send({
        message: 'Content can not be empty!'
      })
    }
    Family.findListByIds(listId, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while get list family!'
        })
      }
      res.status(StatusCodes.CREATED).json(data)
    })
  } catch (error) {
    next(error)
  }
}
