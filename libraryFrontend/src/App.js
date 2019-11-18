import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { useMutation } from 'react-apollo-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_BIRTHYEAR } from './queryes_mutations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  //const [token, setToken] = useState(null)

  const handleError = (error) => {
    //setErrorMessage(error.graphQLErrors[0].message)
    setErrorMessage('Error: wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  /* const [login] = useMutation(LOGIN, {
    onError: handleError
  }) */

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Query query = {ALL_AUTHORS}>
        {(result) => <Authors show = {page === 'authors'} result = {result}  editAuthor = {changeBirthyear}/>}
      </Query>

      <Query query = {ALL_BOOKS}>
        {(result) => <Books show = {page === 'books'} result = {result}/>}
      </Query>

      <Mutation mutation = {CREATE_BOOK}
        refetchQueries={[{ query: ALL_BOOKS}, {query: ALL_AUTHORS}]}
        onError = {handleError}>
        
        {(addBook) => 
          <NewBook show = {page === 'add'} addBook = {addBook}
            errorMessage = {errorMessage}  
          />
        }
      </Mutation>
    </div>
  )
}

export default App