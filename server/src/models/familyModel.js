const { ObjectId } = require('mongodb')
const { GET_DB } = require('../config/mongodb')
const { MEMBER_COLLECTION_NAME } = require('./memberModel')

const FAMILY_COLLECTION_NAME = 'families'
const findOneById = async id =>
  await GET_DB()
    .collection(FAMILY_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })

const Family = function (family) {
  this.type = family.type
  this.husband = family.husband
  this.wife = family.wife
  this.exWife = family.exWife
  this.children = family.children
}

Family.create = async (familyNew, result) => {
  try {
    const validDataToAdd = { ...familyNew }
    if (familyNew.husband) validDataToAdd.husband = new ObjectId(familyNew.husband)
    if (familyNew.wife) validDataToAdd.wife = new ObjectId(familyNew.wife)
    if (familyNew.exWife) validDataToAdd.exWife = new ObjectId(familyNew.exWife)
    if (familyNew.children.length) validDataToAdd.children.map(child => new ObjectId(child))
    const familyInserted = await GET_DB()
      .collection(FAMILY_COLLECTION_NAME)
      .insertOne(validDataToAdd)
    const familyCreated = await findOneById(familyInserted.insertedId)
    result(null, familyCreated)
  } catch (error) {
    result(error, null)
  }
}

Family.findOneById = async (id, result) => {
  try {
    const family = await GET_DB()
      .collection(FAMILY_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: MEMBER_COLLECTION_NAME,
            localField: 'husbandId',
            foreignField: '_id',
            as: 'husband'
          }
        },
        {
          $lookup: {
            from: MEMBER_COLLECTION_NAME,
            localField: 'wifeId',
            foreignField: '_id',
            as: 'wife'
          }
        },
        {
          $lookup: {
            from: MEMBER_COLLECTION_NAME,
            localField: 'exWifeId',
            foreignField: '_id',
            as: 'exWife'
          }
        },
        {
          $lookup: {
            from: MEMBER_COLLECTION_NAME,
            localField: 'childrenIds',
            foreignField: '_id',
            as: 'children'
          }
        },
        { $project: { _destroy: 0, husbandId: 0, wifeId: 0, exWifeId: 0, childrenIds: 0 } }
      ])
      .toArray()
    result(null, family)
  } catch (error) {
    result(error, null)
  }
}

module.exports = Family
