const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')
const method = require('./method')
const { model, Schema } = require('mongoose')
const extend = require('../utils/extend-mongoose')
const { UserTC } = require('./user/user')
const createModel = (name, definition) => {
    const modelSchema = new mongoose.Schema({
        created: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    })

    const AdminUserSchema = extend(modelSchema, definition, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })
    const model = mongoose.model(name, AdminUserSchema)

    const customizationOptions = {}

    const tc = composeWithMongoose(model, customizationOptions)
    // tc.addRelation('created', {
    //     resolver: () => UserTC.getResolver('findById'),
    //     prepareArgs: {
    //         _id: (source) => source.created,
    //         skip: null,
    //         sort: null,
    //     },
    //     projection: { created: true },
    // })

    // UserTC.addRelation(name, {
    //     resolver: () => tc.getResolver('findMany'),
    //     prepareArgs: {
    //         filter: (source) => ({ created: source._id }),
    //     },
    //     projection: { id: true },
    // })
    return method(tc, name)
}

module.exports = createModel
