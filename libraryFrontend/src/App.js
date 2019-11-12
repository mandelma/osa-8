import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { useMutation } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_BIRTHYEAR } from './Queryes'

const App = () => {
  const [page, setPage] = useState('authors')

  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Query query = {ALL_AUTHORS}>
        {(result) => <Authors show = {page === 'authors'} result = {result} editAuthor = {changeBirthyear}/>}
      </Query>

      <Query query = {ALL_BOOKS}>
        {(result) => <Books show = {page === 'books'} result = {result}/>}
      </Query>

      <Mutation mutation = {CREATE_BOOK}
        refetchQueries={[{ query: ALL_BOOKS}, {query: ALL_AUTHORS}]}>
        
        {(addBook) => 
          <NewBook show = {page === 'add'} addBook = {addBook} />
        }
      </Mutation>
    </div>
  )
}

export default App