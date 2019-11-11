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
    author
    genres
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
    author
    published
    genres
  }
}
`

export { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK }