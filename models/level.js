const mongoose = require('mongoose')

const levelSchema = new mongoose.Schema({
  server: String,
  user: String,
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 0
  },
  last: {
    type: Date,
    default: 0
  }
});

levelSchema.index({ server: 1, user: 1 }, { unique: true });

levelSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Level', levelSchema);