const mongoose = require('mongoose')

const projectDetailsSchema = new mongoose.Schema({
  language: String,
  framework: String,
  library: String,
  database: String,
})

projectDetailsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('ProjectDetails', projectDetailsSchema)
