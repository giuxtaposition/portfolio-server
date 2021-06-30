const { UserInputError, PubSub } = require('apollo-server-express')
const config = require('../utils/config')
const pubsub = new PubSub()
const Project = require('../models/project')
const User = require('../models/user')
const ProjectDetails = require('../models/projectDetails')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  Project: {
    img: (parent, _, { url }) =>
      parent.img && `${url}/images/projects/${parent.img}`,
  },
  Query: {
    projectCount: () => Project.collection.countDocuments(),
    allProjects: async () => {
      return await Project.find({}).populate('details')
    },
    me: (root, args, { currentUser }) => {
      return currentUser
    },
  },
  Mutation: {
    addProject: async (root, args, { currentUser }) => {
      // Check if user is logged in
      if (!currentUser) {
        throw new UserInputError('You must be logged in to add a new book')
      }

      let projectDetails = new ProjectDetails({
        language: args.language,
        framework: args.framework,
        library: args.library,
        database: args.database,
        id: uuidv4(),
      })
      try {
        await projectDetails.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      let project = new Project({
        ...args,
        id: uuidv4(),
        details: projectDetails,
      })
      await project.save()

      // Publish subscription
      pubsub.publish('PROJECT_ADDED', { projectAdded: project })

      return project
    },
    editProject: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new UserInputError(
          'You must be logged in to edit an projectDetails'
        )
      }

      let project = Project.findByIdAndUpdate(
        args.id,
        { ...args },
        function (err, docs) {
          if (err) {
            throw new UserInputError('Project not found')
          } else {
            console.log('Updated Project: ', docs)
          }
        }
      )

      return project.populate('details')
    },
    createUser: async (root, args) => {
      const newUser = new User({ ...args })

      try {
        await newUser.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return newUser
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== config.JWT_SECRET) {
        throw new UserInputError('Wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      // Return a new token with the key 'value' and the token value,
      // just like the schema
      return { value: jwt.sign(userForToken, config.JWT_SECRET) }
    },
  },
  Subscription: {
    projectAdded: {
      subscribe: () => pubsub.asyncIterator(['PROJECT_ADDED']),
    },
  },
}
