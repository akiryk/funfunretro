const { Queries } = require('./queries_schema');
const { Mutations } = require('./mutations_schema');

const typeDefs = [Queries, Mutations];

module.exports = { typeDefs };
