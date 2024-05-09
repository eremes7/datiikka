const tekstiRouter = require('express').Router()
const Teksti = require('../models/teksti')
const middleWare = require('../utils/middleware')

const jwt = require('jsonwebtoken')

tekstiRouter.get('/', async (request, response) => {
  Teksti
    .find({})
    .then(tekstit => {
      response.json(tekstit)
    })
})

tekstiRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    let decodedToken = null 
    try {
      decodedToken = jwt.verify(middleWare.tokenExtractor(request), process.env.SECRET)
      console.log('decodedToken:', decodedToken)
    } catch (error) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.otsikko || !body.avain || !body.sisältö || !body.kategoria) {
      return response.status(400).json({ error: 'content missing' })
    }

    const teksti = new Teksti({
      otsikko: body.otsikko,
      avain: body.avain,
      sisältö: body.sisältö,
      kategoria: body.kategoria
    })
    const existingTeksti = await Teksti.findOne({ avain: body.avain })
    if (existingTeksti) {
      return response.status(400).json({ error: 'teksti already exists' })
    }

    const savedTeksti = await teksti.save()
    response.status(201).json(savedTeksti)

  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
})

module.exports = tekstiRouter
