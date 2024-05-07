const Kappale = require('../models/kappale')

describe('Kappale Model', () => {
  test('Sisältää kaikki tarvittavat muuttujat', () => {
    const kappale = new Kappale({
      nimi: 'TestiKappale',
      kappaleId: 1,
      sanat: 'TestiSanat',
      kategoria: 'TestiKategoria'
    })

    expect(kappale.nimi).toBeDefined()
    expect(kappale.kappaleId).toBeDefined()
    expect(kappale.sanat).toBeDefined()
    expect(kappale.kategoria).toBeDefined()
  })

  test('Kappale muuttuu oikein JSONiksi', () => {
    const kappale = new Kappale({
      nimi: 'TestiKappale',
      kappaleId: 1,
      sanat: 'TestiSanat',
      kategoria: 'TestiKategoria',
    })

    const jsonKappale = kappale.toJSON()

    expect(jsonKappale.nimi).toBeDefined()
    expect(jsonKappale.kappaleId).toBeDefined()
    expect(jsonKappale.sanat).toBeDefined()
    expect(jsonKappale.kategoria).toBeDefined()
    expect(typeof jsonKappale.id).toBe('string')
    expect(jsonKappale._id).toBeUndefined()
    expect(jsonKappale.__v).toBeUndefined()
  })
})