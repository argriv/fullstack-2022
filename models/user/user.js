const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')
const { schemaComposer } = require('graphql-compose')
const dotenv = require('dotenv')
dotenv.config()

const userSchema = new mongoose.Schema(
    {
        username: String,
        secret: String,
        isAdmin: Boolean,
    },
    {
        collection: 'users',
        timestamps: true,
    }
)
const customizationOptions = {}
const User = mongoose.model('User', userSchema)
const UserTC = composeWithMongoose(User, customizationOptions).addFields({
    token: { type: 'String' },
})

UserTC.addResolver({
    kind: 'mutation',
    name: 'login',
    type: `type LoginPayload { userId: MongoID, username: String, token: String, isAdmin: Boolean }`,
    args: {
        username: 'String!',
        secret: 'String!',
    },
    resolve: async ({ args }) => {
        const user = await User.findOne({
            username: typeof args.username === 'string' ? args.username : '',
        })
        if (!user) {
            throw new Error('No user exists.')
        }
        const correctPass = await bcrypt.compare(args.secret, user.secret)
        if (!correctPass) {
            throw new Error('Password is not correct.')
        }

        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h',
            }
        )

        return {
            userId: user._id,
            username: user.username,
            token: token,
            isAdmin: user.isAdmin,
        }
    },
})

UserTC.addResolver({
    kind: 'mutation',
    name: 'register',
    type: `type RegisterPayload { username: String! }`,
    args: {
        username: 'String!',
        secret: 'String!',
    },
    resolve: async ({ args }) => {
        const user = await User.findOne({
            username: args.username,
        })
        if (user) {
            throw new Error('User with username exists.')
        }

        const hashedPass = await bcrypt.hash(args.secret, 10)
        const newuser = await User.create({
            username: args.username,
            secret: hashedPass,
            isAdmin: false,
        })
        return { username: newuser.username }
    },
})

schemaComposer.Query.addFields({
    user_ById: UserTC.getResolver('findById'),
    user_ByIds: UserTC.getResolver('findByIds'),
    user_Many: UserTC.getResolver('findMany'),
})
schemaComposer.Mutation.addFields({
    register: UserTC.getResolver('register'),
    loginResolver: UserTC.getResolver('login'),
})

schemaComposer.buildSchema()
module.exports = { UserTC }
