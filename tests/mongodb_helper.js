const { MongoMemoryServer } =  require('mongodb-memory-server')

module.exports = async () => {
  const mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  process.env.MONGODB_URI = mongoUri

  global.__MONGOSERVER__ = mongo
}



