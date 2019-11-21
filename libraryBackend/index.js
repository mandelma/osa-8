require('dotenv').config()
const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/books')
const Author = require('./models/authors')
const User = require('./models/users')
const jwt = require('jsonwebtoken')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
const SECRET = process.env.SECRET

console.log('connectingn to ', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB: ', error.message)
  })

const typeDefs = gql`
  type User{
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token{
    value: String!
  }

  type Book{
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type Author{
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    authorCount: Int!
    bookCount(name: String): Int!
    allBooks(name: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
 
  type Mutation{
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token

    addBook(
      title: String!
      published: String!
      author: String!
      genres: [String!]
    ): Book
    editAuthor(
      name: String!
      born: Int
    ): Author
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },

    authorCount: () => { return Author.collection.countDocuments() },

    allBooks: async (root, args) => {
      if(!args.name && !args.genre){
        const books = await Book.find({}).populate('author')
        return books
      }
      else if(args.genre && !args.name){
        return await Book.find({ genres: {$in: [args.genre] }})
      }
      else if(!args.genre && args.name){
        const author =  Author.findOne({name: args.name})
        return await Book.find({ author: author._id })
      }   
    },

    bookCount: async (root, args) => {
      if(!args.name){
        return Book.collection.countDocuments()
      }
      const bookAuthor = await Author.findOne({ name: args.name })
      return Book.collection.countDocuments({ author: bookAuthor._id })
    },
      
    allAuthors: () => Author.find({}),
  },

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id })
      return books.length
    }
  },  
 
  Book: {
    author: (root) => {
      return{
        name: root.author.name,
        born: root.author.born
      }
    }
  },

  Mutation: {

    createUser: (root, args) => {
      const user = new User({ 
        username: args.username,
        favoriteGenre: args.favoriteGenre 
      })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'salainen'){
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, SECRET)}
    },

    addBook: async (root, args, context) => {
      console.log('addbook currentUser: ', context.currentUser)
      if(!context.currentUser){
        throw new AuthenticationError('User is not authenticated')
      }
      const authorExist = await Author.findOne({ name: args.author })
      if(!authorExist){
        try {
        const author = new Author({ name: args.author })
        if(args.title.length >= 2){
          await author.save()
        }   
        const book = new Book({ ...args, author: author._id })
        await book.save() 
        console.log('newBook:', book)
        return Book.findById(book._id).populate('author')
      }catch(error){
        throw new UserInputError(error.message, { invalidArgs: args })
        }
      }
      try{
        const book = new Book({ ...args, author:authorExist._id })
        await book.save()
        return Book.findById(book.id).populate('author')
      }catch(error){
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    },

    editAuthor: async (root, args, { currentUser }) => {
      if(!currentUser){
        throw new AuthenticationError('User is not authenticated')
      }
      console.log('etit currentUser: ', currentUser)
      const author = await Author.findOne({ name: args.name })
      if(!author){
        return null
      }
      try{
        await Author.updateOne({ "name": args.name }, { $set: { "born": args.born } })
        return Author.findOne({ name: args.name })
      }catch(error){
        throw new UserInputError(error.message, { invalidArgs: args })
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(auth.substring(7), SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})


server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})