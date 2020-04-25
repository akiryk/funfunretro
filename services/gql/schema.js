const { Queries } = require('./queries/queries_schema');
const { Mutations } = require('./mutations/mutations_schema');

const typeDefs = [Queries, Mutations];

module.exports = { typeDefs };
