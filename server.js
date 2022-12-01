const { ApolloServer } = require('apollo-server-express')
const {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core')
const express = require('express')
const http = require('http')

async function startApolloServer(schema) {
    const app = express()
    const httpServer = http.createServer(app)
    const server = new ApolloServer({
        schema: schema,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
    })
    await server.start()
    server.applyMiddleware({ app })
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

module.exports = startApolloServer
