/* eslint-disable no-console */
const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const ApiError = require('../utils/ApiError')
const { TAG_USER, GENDER_MEMBER } = require('../utils/constants')
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators')
const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

const correctCondition = Joi.object({
  title: Joi.string()
    .valid(TAG_USER.DAUGHTER, TAG_USER.EMPTY, TAG_USER.HUSBAND, TAG_USER.SON, TAG_USER.WIFE)
    .trim()
    .strict()
    .default(''),
  gender: Joi.string().required().valid(GENDER_MEMBER.FEMALE, GENDER_MEMBER.MALE).trim().strict(),
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
  dad: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null)
})

const createNew = async (req, res, next) => {
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const memberValidation = {
  createNew
}
module.exports = { memberValidation }
