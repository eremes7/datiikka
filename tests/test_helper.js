const User = require('../models/user')
const Tekstit = require('../models/kappale')


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const tekstitInDb = async () => {
  const tekstit = await Tekstit.find({})
  return tekstit.map(teksti => tekstit.toJSON())
}

module.exports = {
  usersInDb,
  tekstitInDb 
}
