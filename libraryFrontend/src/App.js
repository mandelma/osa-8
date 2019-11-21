import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, 
  EDIT_BIRTHYEAR, LOGIN, GENRE, BOOKS_BY_GENRE  } from './queryes_mutations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const handleError = (error) => {
    //setErrorMessage(error.graphQLErrors[0].message)
    setErrorMessage(error.graphQLErrors[0].message)
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
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: handleError
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const books = useQuery(ALL_BOOKS)
  const genre = useQuery(GENRE, {
    refetchQueries: [{query: ALL_BOOKS}]
  })

  const logIn = async (username, password) => {
    try{
      const result = await login({
        variables: { username, password }
      })
      if(result){
        const token = result.data.login.value
        setToken(token)
        localStorage.setItem('kirjasto-user-token', token)
        setPage('authors')
      }
    }catch(error){
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }

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
        <button onClick = {() => setPage('recommended')}>recommend</button>
        {userIn ? <button onClick={() => setPage('add')}>add book</button> : null}
        {!userIn ? <button onClick = {() => setPage('login')}>login</button> 
          : <button onClick = {logOut}>log out</button>}
      </div>

      <Query query = {ALL_AUTHORS} onError = {handleError}>
        {(result) => <Authors show = {page === 'authors'} result = {result} 
         editAuthor = {changeBirthyear} errorMessage = {errorMessage}
         setErrorMessage = {setErrorMessage}/>}
      </Query>

      <Books 
        show = {page === 'books'}
        bookList = {books}
      />

      <Mutation mutation = {CREATE_BOOK}
        refetchQueries={[{ query: ALL_BOOKS}, {query: ALL_AUTHORS}]}
        onError = {handleError}>
        
        {(addBook) => 
          <NewBook show = {page === 'add'} addBook = {addBook}
            errorhandler = {loginError}
            errorMessage = {errorMessage}
            setErrorMessage = {setErrorMessage}
          />
        }
      </Mutation>
      <Recommended
        show = {page === 'recommended'}
        result = {books}
        genre = {genre}
      />
      <LoginForm
        show = {page === 'login'}
        setErrorMessage = {setErrorMessage}
        errorMessage = {loginError}
        //login = {login}
        login = {logIn}
        setToken = {setToken}
        setPage = {setPage}
        token = {token}
      />
    </div>
  )
}


export default App