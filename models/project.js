const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: String,
  img: String,
  description: String,
  projectLink: String,
  projectGithub: String,
  category: [String],
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectDetails',
  },
})

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Project', projectSchema)
