import React, { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!props.show) {
    return null
  }
  else if(props.result.loading){
    return <div>loading...</div>
  }

 const editBorn = async (e) => {
    e.preventDefault()
    try{
      const birthYear = Number(born)
      await props.editAuthor({
        variables: { name, birthYear }
      })
    }catch(error){
      props.setErrorMessage(error.message)
      setTimeout(() => {
        props.setErrorMessage(null)
      }, 5000)
    }
    
    setName('')
    setBorn('')

  }
  const authors = props.result.data.allAuthors
  return (
    <div>
      {props.errorMessage &&
      <div style = {{color: 'red'}}>
        {props.errorMessage}
      </div>   }
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit = {editBorn}>
        <label>Name:</label><br/>

        <select value = {name} onChange = {({ target }) => setName(target.value)}>
          <option>Select author</option>
          {authors.map(author => 
            <option key = {author.name}
                value = {author.name}
              >
              {author.name}
          </option>)}
        </select><br/>
        <label>Born:</label><br/>
        <input
          type = 'number'
          value = {born}
          onChange = {({ target }) => setBorn(target.value)} /><br/><br/>
        <button type = 'submit'>Change birthyear</button>
      </form>
      <p>{name}</p>
      <p>{born}</p>
    </div>
  )
}

export default Authors