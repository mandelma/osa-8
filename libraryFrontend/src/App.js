import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { useMutation, useApolloClient } from 'react-apollo-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_BIRTHYEAR, LOGIN } from './queryes_mutations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const handleError = (error) => {
    //setErrorMessage(error.graphQLErrors[0].message)
    setErrorMessage('Error: wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

    const loginError = () => {
      if(errorMessage === null){
        return <div></div>
      }
    return <div style = {{color: 'red'}}>{errorMessage}</div>
    }

  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const logOut = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const userIn = localStorage.getItem('kirjasto-user-token')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        
        {userIn ? <button onClick={() => setPage('add')}>add book</button> : null}
        {!userIn ? <button onClick = {() => setPage('login')}>login</button> 
          : <button onClick = {logOut}>log out</button>}
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
      <LoginForm
        show = {page === 'login'}
        setErrorMessage = {setErrorMessage}
        errorMessage = {loginError}
        login = {login}
        setToken = {setToken}
        setPage = {setPage}
      />
    </div>
  )
}

export default App