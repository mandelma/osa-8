import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (!props.show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()
    props.login(username, password)
    
    setUsername('')
    setPassword('')
  }

  return(
    <div>
    {props.errorMessage()}
      <h2>Login</h2>
      <form onSubmit = {submit}>
        <div>
          Username: <input
            value = {username}
            onChange = {({target}) => setUsername(target.value)}
          /><br/><br/>
        </div>
        <div>
          Password: <input
            value = {password}
            type = 'password'
            onChange = {({target}) => setPassword(target.value)}
          /><br/><br/>
        </div>
        <div>
          <button type = 'submit'>Login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm