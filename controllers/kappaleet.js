const kappaleRouter = require('express').Router()
const Kappale = require('../models/kappale')
const middleWare = require('../utils/middleware')

const jwt = require('jsonwebtoken')


kappaleRouter.get('/', async (request, response) => {
  Kappale
    .find({})
    .then(kappaleet => {
      response.json(kappaleet)
    })
})

kappaleRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    let decodedToken = null 
    try {
      decodedToken = jwt.verify(middleWare.tokenExtractor(request), process.env.SECRET)
    } catch (error) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.nimi || !body.kappaleId || !body.sanat || !body.kategoria) {
      return response.status(400).json({ error: 'content missing' })
    }

    const kappale = new Kappale({
      nimi: body.nimi,
      kappaleId: body.kappaleId,
      sanat: body.sanat,
      kategoria: body.kategoria,
      alkuperäinen: body.alkuperäinen
    })
    const existingKappale = await Kappale.findOne({ kappaleId: body.kappaleId })
    if (existingKappale) {
      return response.status(400).json({ error: 'kappale already exists' })
    }

    const savedKappale = await kappale.save()
    response.status(201).json(savedKappale)

  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
})

module.exports = kappaleRouter


