const { schemaComposer } = require('graphql-compose')
require('./contract')
require('./user/user')
const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
