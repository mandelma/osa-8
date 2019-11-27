import { gql } from 'apollo-boost'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`
const BOOK_DETAILS = gql`
  fragment BookDetails on Book{
    title
    published
    author{
      name
      born
      bookCount
    }
    genres
  } 
`
const ALL_BOOKS = gql`
{
  allBooks{
    ...BookDetails
   
  }
}
${BOOK_DETAILS}
`
const LOGIN = gql`
mutation login($username: String!, $password: String!){
  login(username: $username, password: $password){
    value
  }
}
`
const GENRE = gql`
{
  me {
    username
    favoriteGenre
  }
}
`

const CREATE_BOOK = gql`
mutation createBook(
  $title: String!, $published: String!, $author: String!, $genres: [String!]
){
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ){
    title
    author{
      name
      born
      bookCount
    }
    published
    genres
  }
}
`
const EDIT_BIRTHYEAR = gql`
mutation editBirthyear($name: String!, $birthYear: Int!){
  editAuthor(name: $name, born: $birthYear){
    name
    born
  }
}
`
const BOOKS_BY_GENRE = gql`
query booksByGenre($genre: String!){
  allBooks(genre: $genre){
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_BIRTHYEAR, LOGIN, GENRE, BOOKS_BY_GENRE }