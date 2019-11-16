require('dotenv').config()
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/books')
const Author = require('./models/authors')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI
console.log('connectingn to ', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB: ', error.message)
  })

const typeDefs = gql`
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
  }

  type Mutation{
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
    authorCount: () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      if(!args.name && !args.genre){
        const books = await Book.find({}).populate('author')
        return books
      }
      else if(args.genre && !args.name){
        const books = await Book.find({genres: {$in: [args.genre]}})
        return books
      }
      else if(!args.genre && args.name){
        const author = await Author.findOne({name: args.name})
        const books = await Book.find({author: author._id})
        return books
      }
    },

    bookCount: async (root, args) => {
      if(!args.name){
        return Book.collection.countDocuments()
      }
      const bookAuthor = await Author.findOne({name: args.name})
      return Book.collection.countDocuments({author: bookAuthor._id})
    },
      
    allAuthors: () => Author.find({}),
  },

  Author: {
    bookCount: async (root) => {
      console.log('authors root', root)
      const books = await Book.find({author: root._id})
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

    addBook: async (root, args) => {
      const authorExist = await Author.findOne({name: args.author})
      if(!authorExist){
        try {
        const author = new Author({name: args.author})
        await author.save()
        const book = new Book({...args, author: author._id})
        await book.save()
        console.log('newBook:', book)
        return Book.findById(book._id).populate('author')
      }catch(error){
        throw new UserInputError(error.message, {invalidArgs: args})
        }
      }
      try{
        const book = new Book({...args, author:authorExist._id})
        await book.save()
        return Book.findById(book.id).populate('author')
      }catch(error){
        throw new UserInputError(error.message, {invalidArgs: args})
      }
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({name: args.name})
      if(!author){
        return null
      }
      try{
        await Author.updateOne({"name": args.name}, {$set: {"born": args.born}})
        return Author.findOne({name: args.name})
      }catch(error){
        throw new UserInputError(error.message, {invalidArgs: args})
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})