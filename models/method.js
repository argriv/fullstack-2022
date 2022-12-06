const { schemaComposer } = require('graphql-compose')
const adminAccess = require('../utils/admin-access')
const method = (tc, name) => (
    schemaComposer.Query.addFields({
        [name + '_ById']: tc.getResolver('findById'),
        [name + '_ByIds']: tc.getResolver('findByIds'),
        [name + '_Many']: tc.getResolver('findMany'),
    }),
    schemaComposer.Mutation.addFields({
        ...adminAccess({
            [name + '_CreateOne']: tc.getResolver('createOne'),
            [name + '_CreateMany']: tc.getResolver('createMany'),
            [name + '_UpdateById']: tc.getResolver('updateById'),
            [name + '_RemoveById']: tc.getResolver('removeById'),
            [name + '_RemoveMany']: tc.getResolver('removeMany'),
        }),
    }),
    schemaComposer.buildSchema()
)
module.exports = method
