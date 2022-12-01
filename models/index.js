const { schemaComposer } = require('graphql-compose')
require('./contract')

const graphqlSchema = schemaComposer.buildSchema()
module.exports = graphqlSchema
