const mongoose = require('mongoose')

const eggSchema = new mongoose.Schema({
  count: Number,
})

eggSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Egg', eggSchema)