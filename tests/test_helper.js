const User = require('../models/user')
const Kappaleet = require('../models/kappale')


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const kappaleetInDb = async () => {
  const kappaleet = await Kappaleet.find({})
  return kappaleet.map(kappale => kappale.toJSON())
}

module.exports = {
  usersInDb,
  kappaleetInDb
}
