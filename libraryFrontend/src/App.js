import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import { useQuery, useMutation, useSubscription, useApolloClient } from 'react-apollo-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { BOOK_ADDED } from './subscriptions'
import { ALL_AUTHORS, CREATE_BOOK, ALL_BOOKS,
  EDIT_BIRTHYEAR, LOGIN, GENRE  } from './queryes_mutations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const handleError = (error) => {
    //setErrorMessage(error.graphQLErrors[0].message)
    setMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const notify = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const loginError = () => {
    if(errorMessage === null){
      return <div></div>
    }
  return <div style = {{color: 'red'}}>{errorMessage}</div>
  }

  const updateCacheWith = (addedBook) => {
    const includeAuthorIn = (set, object) => {
      set.map(a => a.name).includes(object.author.name)
    }
    const authorDataInStore = client.readQuery({ query: ALL_AUTHORS })

    const findAuthor = includeAuthorIn(authorDataInStore.allAuthors, addedBook)
    if(!findAuthor){
      
      authorDataInStore.allAuthors.push(addedBook.author)
    
      client.writeQuery({
        query: ALL_AUTHORS,
        data: authorDataInStore
      })
    }

    const includeBookIn = (set, object) => {
      set.map(b => b.id).includes(object.id)
    }

    const bookDataInStore = client.readQuery({ query: ALL_BOOKS})
    
    if(!includeBookIn(bookDataInStore.allBooks, addedBook)){
      bookDataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: bookDataInStore
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedAuthor = subscriptionData.data.bookAdded.author

      const addedBook = subscriptionData.data.bookAdded
      notify(`New book '${addedBook.title}' from ${addedAuthor.name}`)
      updateCacheWith(addedBook)
    }
  })

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
    setPage('authors')
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
      {message && <div style = {{color: 'green'}}>{message}</div>}
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
        onError = {handleError}
        update = {(store, response) => {
          updateCacheWith(response.data.addBook)}}
        >
        
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
        login = {logIn}
        setToken = {setToken}
        setPage = {setPage}
        token = {token}
      />
    </div>
  )
}


export default App