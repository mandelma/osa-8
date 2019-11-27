import React, { useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo-hooks'

import { GENRE, BOOKS_BY_GENRE } from '../queryes_mutations'

const Recommended = ({ result, show }) => {
  const [favBooks, setFavBooks] = useState([])
  const [genre, setGenre] = useState('')
  const client = useApolloClient()

  const userIn = localStorage.getItem('kirjasto-user-token')

  useEffect(() => {
    favoriteBooks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  
  const favoriteBooks = async () => {
   if(!userIn){
      return
    }
    const favGenre = await client.query({
      query: GENRE
    })
    setGenre(favGenre.data.me.favoriteGenre)
    const favorite = await client.query({
      query: BOOKS_BY_GENRE,
      variables: {genre: genre},
      fetchPolicy: 'no-cache'
    })
    setFavBooks(favorite.data.allBooks)
  }
  
  if(!show){
    return null
  }

  return(
    <div>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favBooks.map(book => 
            <tr key = {book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended