import React, { useState } from 'react'
import { Query } from 'react-apollo'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS} from './Queryes'

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

      <Query query = {ALL_BOOKS}>
        {(result) => <Books show = {page === 'books'} result = {result}/>}
      </Query>

      <NewBook
        show={page === 'add'}
      />
    </div>
  )
}

export default App