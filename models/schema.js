const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')
const method = require('./method')

const createModel = (name, definition) => {
    const model = mongoose.model(name, definition)
    const customizationOptions = {}
    const tc = composeWithMongoose(model, customizationOptions)
    return method(tc, name)
}

module.exports = createModel
