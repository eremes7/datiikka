const Teksti = require('./models/teksti')
const axios = require('axios')

const dummyKappaleet = require('./dummy')
const Teksti = require('../models/teksti')

console.log(dummyKappaleet)
console.log('pröööt')

const newTeksti = new Teksti({
  otsikko: 'kalja-arvostelu',
  avain: 'kaljaaa',
  sisältö: 'pröötsis, pröötsis, pröööööt',
  kategoria: 'Isänmaa'
})

axios.post('http://localhost:3003/api/tekstit', newTeksti)
  .then(response => {
    console.log('Vastaus palvelimelta:', response.data)
  })
  .catch(error => {
    console.error('Virhe POST-pyynnössä:', error)
  })

app.listen(config.PORT, () => {
  console.log(`Serveri pyörii portissa: ${config.PORT}`)
})




