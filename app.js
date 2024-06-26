const express = require('express')
const app = express()
const cors = require('cors')

const { connectToDatabase } = require('./utils/connect')
const tekstiRouter= require('./controllers/tekstit')
const usersRouter = require('./controllers/users')

const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

connectToDatabase()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


app.use(middleware.requestLogger)


app.use('/api/tekstit', tekstiRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)


app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)


module.exports = app
