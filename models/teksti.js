const mongoose = require('mongoose')

const tekstiSchema = mongoose.Schema({
  otsikko: String,
  avain: String,
  kategoria: String,
  sisältö: String
})

tekstiSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Teksti', tekstiSchema)
