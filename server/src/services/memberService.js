/* eslint-disable no-useless-catch */
const { memberModel } = require('../models/memberModel')

const createNew = async reqBody => {
  try {
    const createdMember = await memberModel.createNew(reqBody)
    const memberNew = await memberModel.findOneById(createdMember.insertedId)
    return memberNew
  } catch (error) {
    throw error
  }
}

const memberService = {
  createNew
}
module.exports = { memberService }
