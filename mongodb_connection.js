const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const localUri = process.env.MONGODB_URI_LOCAL
mongoose.connect(localUri, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('connected!')
})
