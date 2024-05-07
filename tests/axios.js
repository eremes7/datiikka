const Kappale = require('./models/kappale')
const axios = require('axios')

const dummyKappaleet = require('./dummy')

console.log(dummyKappaleet)
console.log('pröööt')

const newKappale = new Kappale({
  nimi: 'pröötbiisi',
  id: 101,
  alkuperäinen: 'pröörprööt',
  sanat: 'pröötsis, pröötsis, pröööööt',
  kategoria: 'Isänmaa'
})

axios.post('http://localhost:3003/api/kappaleet', newKappale)
  .then(response => {
    console.log('Vastaus palvelimelta:', response.data)
  })
  .catch(error => {
    console.error('Virhe POST-pyynnössä:', error)
  })

app.listen(config.PORT, () => {
  console.log(`Serveri pyörii portissa: ${config.PORT}`)
})




