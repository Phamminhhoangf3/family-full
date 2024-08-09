const { familyModel } = require('../models/familyModel')

const createNew = async reqBody => {
  try {
    return await familyModel.createNew(reqBody)
  } catch (error) {
    throw error
  }
}

const familyService = {
  createNew
}
module.exports = { familyService }
