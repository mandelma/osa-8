import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Query query = {ALL_AUTHORS}>
        {(result) => <Authors show = {page === 'authors'} result = {result} />}
      </Query>

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
    </div>
  )
}

export default App