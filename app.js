const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const contactRouter = require('./controllers/contact')
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const config = require('./utils/config')

const User = require('./models/user')

console.log('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    let currentUser = []
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(auth.substring(7), config.JWT_SECRET)
      currentUser = await User.findById(decodedToken.id)
    }

    return {
      currentUser: currentUser.length ? currentUser : undefined,
      url: req.protocol + '://' + req.get('host'),
    }
  },
})

server.applyMiddleware({ app })

app.use(cors())
app.use(express.json())
app.use('/contact', contactRouter)
app.use('/images', express.static('images'))

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(config.PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${config.PORT}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${config.PORT}${server.subscriptionsPath}`
  )
})
