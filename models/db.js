const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const localUri = process.env.MONGODB_URI_LOCAL

async function connectDB() {
    try {
        await mongoose.connect(localUri)
        console.log('Database connected successfully')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = connectDB;
