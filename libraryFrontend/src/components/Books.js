import React, { useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'

import { BOOKS_BY_GENRE, ALL_BOOKS } from '../queryes_mutations'
  
const Books = (props) => {
  const [gBooks, setBooks] = useState([])
  const [bookGenres, setBookGenres] = useState([])
  const client = useApolloClient()
  
  if (!props.show) {
    return null
  }
  if(props.bookList.loading){
    return (<div>loading...</div>)
  }
  
  const books = props.bookList.data.allBooks
  
  books.forEach(book => {
    book.genres.forEach(genre => {
      if(!bookGenres.includes(genre)){
        setBookGenres(bookGenres.concat(genre))
      }
    })
  });

  const bookByGenre = async (genre) => {
    if(genre === 'all'){
      setBooks(books)
    }
    const bookGenre = await client.query({
      query: BOOKS_BY_GENRE,
      variables: {genre: genre},
      update: (store, response) => {
        const data = store.readQuery({ query: ALL_BOOKS })
        data.allBooks.push(response.data.bookGenre)
        store.writeQuery({
          query: ALL_BOOKS,
          data:data
        })
      }
    })
    setBooks(bookGenre.data.allBooks)
  }

  const genreButtons = () => {
    return(
      <div>
        {bookGenres.map(genre => <button key = {genre}
        onClick = {() => bookByGenre(genre)}>{genre}</button>)}
        <button  onClick = {() => bookByGenre('all')}>all genres</button>
      </div>
    )
  }

  if(gBooks.length > 0){
    return(
      <div>
        <h2>books</h2>
        <table>
          <tbody>
            <tr>
              <th>
                title
              </th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {gBooks.map(book => 
              <tr key = {book.title}>
                <td>{book.title}</td>
              </tr>)}
          </tbody>
        </table>
        {genreButtons()}
      </div>
    )
  }
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genreButtons()}
    </div>
  )
}

export default Books