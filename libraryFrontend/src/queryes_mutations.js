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

const ALL_BOOKS = gql`
{
  allBooks{
    title
    published
    author{
      name
      born
    }
    genres
  }
}
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
    title
    author{
      name
      born
    }
    published
    genres
  }
}
`

export { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_BIRTHYEAR, LOGIN, GENRE, BOOKS_BY_GENRE }