require('./mongodb_connection')
const startApolloServer = require('./server')
const graphqlSchema = require('./models/')
startApolloServer(graphqlSchema)
