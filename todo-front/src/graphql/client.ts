import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost/api/graphql' }),
  cache: new InMemoryCache(),
})
