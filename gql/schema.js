const { Queries } = require('./queries/');
const { Mutations } = require('./mutations/');

const typeDefs = [Queries, Mutations];

module.exports = { typeDefs };
