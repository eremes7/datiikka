const mongoose = require('mongoose')

const kappaleSchema = mongoose.Schema({
  nimi: String,
  alkuperäinen: String,
  kappaleId: Number,
  kategoria: String,
  sanat: String
})

kappaleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Kappale', kappaleSchema)
