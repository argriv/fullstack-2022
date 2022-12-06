const { ApolloServer } = require('apollo-server-express')
const {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core')
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

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
        context: ({ req }) => {
            const header = req.headers.authorization

            // not found
            if (!header) return { isAuth: false }

            // token
            const token = header.split(' ')

            // token not found
            if (!token) return { isAuth: false }

            let decodeToken

            try {
                decodeToken = jwt.verify(token[1], privateKey)
            } catch (err) {
                return { isAuth: false }
            }

            // in case any error found
            if (!!!decodeToken) return { isAuth: false }

            // token decoded successfully, and extracted data
            return { isAuth: true, userId: decodeToken.userId }
        },
    })
    await server.start()
    server.applyMiddleware({ app })
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

module.exports = startApolloServer
