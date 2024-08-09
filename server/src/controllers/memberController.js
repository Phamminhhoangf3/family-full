/* eslint-disable no-console */
const { StatusCodes } = require('http-status-codes')
const { TAG_USER, TYPE_MEMBER, GENDER_MEMBER } = require('../utils/constants')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')
const { Member } = require('../models/memberModel.js')
const Joi = require('joi')
const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

const USER_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string()
    .valid(TAG_USER.DAUGHTER, TAG_USER.EMPTY, TAG_USER.HUSBAND, TAG_USER.SON, TAG_USER.WIFE)
    .trim()
    .strict()
    .default(''),
  gender: Joi.string().required().valid(GENDER_MEMBER.FEMALE, GENDER_MEMBER.MALE).trim().strict(),
  type: Joi.string().required().valid(TYPE_MEMBER.CHILDREN, TYPE_MEMBER.FAMILY).trim().strict(),
  name: Joi.string().required().min(2).max(25).trim().strict(),
  image: Joi.string().required().trim().strict(),
  fromDob: Joi.string().custom((value, helpers) => {
    if (!moment(value, dateFormat, true).isValid()) {
      return helpers.message(`"fromDob" must be a valid date in format ${dateFormat}`)
    }
    return value
  }),
  toDob: Joi.string().custom((value, helpers) => {
    if (!moment(value, dateFormat, true).isValid()) {
      return helpers.message(`"toDob" must be a valid date in format ${dateFormat}`)
    }
    return value
  }),
  familyId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  dad: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(null),
  _destroy: Joi.boolean().default(false)
})

const validationBeforeCreate = async data => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

exports.createNew = async (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!'
      })
    }
    const member = new Member({
      tag: req.body.tag,
      title: req.body.title,
      type: req.body.type,
      name: req.body.name,
      fromDob: req.body.fromDob,
      toDob: req.body.toDob,
      familyId: req.body.familyId,
      dad: req.body.dad,
      image: req.body.image
    })
    const memberValid = await validationBeforeCreate(member)
    if (!memberValid) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Member invalid!'
      })
    }
    Member.create(memberValid, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while creating the Member.'
        })
      }
      res.status(StatusCodes.CREATED).json(data)
    })
  } catch (error) {
    next(error)
  }
}

exports.getList = async (req, res, next) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!'
      })
    }
    Member.findAll(req.body, (error, data) => {
      if (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message || 'Some error occurred while get list the Member.'
        })
      }
      res.status(StatusCodes.OK).json(data)
    })
  } catch (error) {
    next(error)
  }
}
