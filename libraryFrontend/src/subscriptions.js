import { gql } from 'apollo-boost'

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author{
        name
        born
        bookCount
      }
      genres
    }
  }
`

export { BOOK_ADDED }