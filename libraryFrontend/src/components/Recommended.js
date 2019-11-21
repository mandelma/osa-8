import React from 'react'

const Recommended = (props) => {
  if(!props.show){
    return null
  }

  const userIn = localStorage.getItem('kirjasto-user-token')
  
  if(userIn){
    if(props.result.loading){
      return(
        <div>
          loading...
        </div>
      )
    }
    
    const genre = props.genre.data.me
    const userGenre = genre ? genre.favoriteGenre : 'loading...'
    const books = props.result.data.allBooks

    return(
      <div>
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map(book => book.genres.find(g => userIn && g.includes(userGenre)) ?
              <tr key = {book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr> : null
              )}
            
          </tbody>
        </table>
      </div>
    )
  }else{
    return(
      <div></div>
    )
  }
}
 

export default Recommended