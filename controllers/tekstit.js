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

tekstiRouter.post('/', middleWare.tokenExtractor, middleWare.checkToken, async (request, response) => {
  const body = request.body
  if (!body.otsikko || !body.avain || !body.sisältö || !body.kategoria) {
    return response.status(400).json({ error: 'content missing' })
  }

  const existingTeksti = await Teksti.findOne({ avain: body.avain })
  if (existingTeksti) {
    return response.status(400).json({ error: 'teksti already exists' })
  }

  const teksti = new Teksti({
    otsikko: body.otsikko,
    avain: body.avain,
    sisältö: body.sisältö,
    kategoria: body.kategoria
  })
  
  const savedTeksti = await teksti.save()
  response.status(201).json(savedTeksti)
})

module.exports = tekstiRouter
