const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try{
    const { username, name, password } = request.body

    if (!username || username.length < 3) {
      return response.status(400).json({ message: 'Username too short' })
    }

    if (!name || name.length < 3) {
      return response.status(400).json({ message: 'Name too short' })
    }

    if (!password || password.length < 3) {
      return response.status(400).json({ message: 'Password too short' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({ message: 'Username already exists' })
    }

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    response.status(500).json({ message : 'Error creating new user' })
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('name', { content: 1, important: 1 })
  response.json(users)
})

module.exports = usersRouter
