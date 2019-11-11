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

export { ALL_AUTHORS, ALL_BOOKS }