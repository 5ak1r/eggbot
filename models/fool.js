const mongoose = require('mongoose');

const foolSchema = new mongoose.Schema({
  server: String,
  counts: {
    type: Map,
    of: Number,
    default: {}
  }
})

foolSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Fool', foolSchema)