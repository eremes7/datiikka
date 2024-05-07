require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGO_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI: MONGODB_URI,
  PORT: PORT,
  testPort: process.env.TEST_PORT,
  Memory: true,
  IP: '127.0.0.1',
  Database: 'webbikalu'
}
