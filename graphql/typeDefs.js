const { gql } = require('apollo-server-express')

module.exports = gql`
  type Project {
    title: String!
    img: String
    description: String
    projectLink: String
    projectGithub: String
    category: [String]
    id: ID!
    details: ProjectDetails!
  }

  type ProjectDetails {
    language: String
    framework: String
    library: String
    database: String
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    projectCount: Int!
    allProjects: [Project!]!
    me: User
  }

  type Mutation {
    addProject(
      title: String!
      img: String
      description: String
      projectLink: String
      projectGithub: String
      category: [String]
      language: String
      framework: String
      library: String
      database: String
    ): Project

    editProject(
      title: String
      img: String
      description: String
      projectLink: String
      projectGithub: String
      category: [String]
      id: ID!
      language: String
      framework: String
      library: String
      database: String
    ): Project

    createUser(username: String!): User

    login(username: String!, password: String!): Token
  }

  type Subscription {
    projectAdded: Project!
  }
`
