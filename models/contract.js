const createModel = require('./schema')

const Contracts = createModel('Contracts', {
    contract: {
        type: String,
    },
})

module.exports = Contracts
