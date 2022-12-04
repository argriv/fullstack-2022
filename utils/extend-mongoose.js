const mongoose = require('mongoose')

const extend = (Schema, definition, options) => {
    return new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        options
    )
}

module.exports = extend
