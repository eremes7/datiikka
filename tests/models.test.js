const Teksti = require('../models/teksti')

describe('Teksti Model', () => {
  test('Sisältää kaikki tarvittavat muuttujat', () => {
    const newTeksti = new Teksti({
      otsikko: 'kalja-arvostelu',
      avain: 'kaljaaa',
      sisältö: 'pröötsis, pröötsis, pröööööt',
      kategoria: 'Isänmaa'
    })

    expect(newTeksti.otsikko).toBeDefined()
    expect(newTeksti.avain).toBeDefined()
    expect(newTeksti.sisältö).toBeDefined()
    expect(newTeksti.kategoria).toBeDefined()
  })

  test('Teksti muuttuu oikein JSONiksi', () => {
    const newTeksti = new Teksti({
      otsikko: 'kalja-arvostelu',
      avain: 'kaljaaa',
      sisältö: 'pröötsis, pröötsis, pröööööt',
      kategoria: 'Isänmaa'
    })

    const jsonTeksti = newTeksti.toJSON()

    expect(jsonTeksti.otsikko).toBeDefined()
    expect(jsonTeksti.avain).toBeDefined()
    expect(jsonTeksti.sisältö).toBeDefined()
    expect(jsonTeksti.kategoria).toBeDefined()
    expect(typeof jsonTeksti.id).toBe('string')
    expect(jsonTeksti._id).toBeUndefined()
    expect(jsonTeksti.__v).toBeUndefined()
  })
})
