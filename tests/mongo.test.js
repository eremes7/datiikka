const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

let token
describe('Tekstien lisääminen', () => {

  beforeAll(async () => {
    console.log('Aloitetaan testaus...')
    const newUser = {
      name: 'TestiKäyttäjä',
      username: 'Testi Käyttäjä',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const loginResponse = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    token = loginResponse.body.token
  })

  test('Tekstin lisääminen onnistuu kirjautuneena käyttäjänä', async () => {
    const newTeksti = {
      otsikko: 'Ässät korkealla',
      avain: 'aces-high',
      sisältö: 'Elää lentääkseen, lentää elääkseen... Ässät korkealla',
      kategoria: 'Hassut laulut'
    }

    const vastaus = await api
      .post('/api/tekstit')
      .set('Authorization', `Bearer ${token}`)
      .send(newTeksti)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(vastaus.statusCode).toBe(201)
  })

  test('Tekstien hakeminen onnistuu', async () => {
    const vastaus = await api
      .get('/api/tekstit')
      .expect(200)

    expect(vastaus.body).not.toEqual([])
    expect(vastaus.body[0].otsikko).toBe('Ässät korkealla')
  })

  test('Tekstin lisääminen ei onnistu ilman kirjautumista', async () => {
    const newTeksti = {
      otsikko: 'Väärä yritys',
      avain: 'wrong-try',
      sisältö: 'Ei kirjautunut',
      kategoria: 'Hassut laulut'
    }

    await api
      .post('/api/tekstit')
      .send(newTeksti)
      .expect(401)
  })

  test('Tekstin lisääminen ei onnistu ilman otsikkoa', async () => {
    const newTeksti = {
      avain: 'no-title',
      sisältö: 'Unohdettiin otsikko',
      kategoria: 'Hassut laulut'
    }

    await api
      .post('/api/tekstit')
      .set('Authorization', `Bearer ${token}`)
      .send(newTeksti)
      .expect(400)
  })

  test('Saman tekstin lisääminen ei onnistu', async () => {
    const newTeksti = {
      otsikko: 'Ässät korkealla',
      avain: 'aces-high',
      sisältö: 'Elää lentääkseen, lentää elääkseen... Ässät korkealla',
      kategoria: 'Hassut laulut'
    }

    await api
      .post('/api/tekstit')
      .set('Authorization', `Bearer ${token}`)
      .send(newTeksti)
      .expect(400)
  })

  test('Palvelin palauttaa 500 virheen, jos yhteyttä ei ole', async () => {
    mongoose.connection.close()
    const newTeksti = {
      otsikko: 'Yhteys katkaistu',
      avain: 'connection-lost',
      sisältö: 'Serveri ei vastaa',
      kategoria: 'Tekninen vika'
    }

    await api
      .post('/api/tekstit')
      .set('Authorization', `Bearer ${token}`)
      .send(newTeksti)
      .expect(500)
  })
})
