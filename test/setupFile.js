const mongoose = require('mongoose')

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI)
})

afterAll(async () => {
  await mongoose.disconnect()
})
