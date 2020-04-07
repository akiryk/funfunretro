const { HttpLink } = require('apollo-link-http');
const { ApolloClient } = require('apollo-boost');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('node-fetch');

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:5000/funfunretro/us-east1/api/graphql',
  fetch,
});

exports.graphQLClient = new ApolloClient({
  link,
  cache,
});
