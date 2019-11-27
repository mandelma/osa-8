import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//import ApolloClient from 'apollo-boost'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true }
})

/* const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    timeout: 20000,
    lazy: true,
  },
})

window.addEventListener('beforeunload', () => {
  // @ts-ignore - the function is private in typescript
  wsLink.subscriptionClient.close();
}); */

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('kirjasto-user-token')
  return{
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }
  }
})

const link = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query)
  return kind === 'OperationDefinition' && operation === 'subscription'
},
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

/* const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
}) */

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App />
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root'))