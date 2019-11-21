import React, { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }
  if(props.bookList.loading){
    return <div>loading...</div>
  }

  const books = props.bookList.data.allBooks
  const genreButtons = () => {
    return(
      <div>
        <button onClick = {() => setGenre('classic')}>classic</button>
        <button onClick = {() => setGenre('horror')}>horror</button>
        <button onClick = {() => setGenre('design')}>desing</button>
        <button onClick = {() => setGenre('crime')}>crime</button>
        <button onClick = {() => setGenre('all')}>all genres</button>
      </div>
    )
  }
  
  const userIn = localStorage.getItem('kirjasto-user-token')

  

  if(genre){
    return(
      <div>
        <h2>books</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books.map(a =>  a.genres.find(g => g.includes(genre)) ?
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr> : null
            )}
            {books.map(a =>  genre === 'all' ?
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr> : null
            )}
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
            <th></th>
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