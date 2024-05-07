const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

// TDD hengessä tehdään testit ja rakennetaan toiminnot sitä mukaa!
//
//testaa, että tietokanta on kappaleista tyhjä
//testaa, että kappaleen lisäys onnistuu
//testaa, että kappaleen hakeminen onnistuu
//testaa, että kappaleissa on vaadittavat muuttujat lisättäessä
//testaa, että samaa id, nimea jne. ei voi lisätä tietokantaan,
//
//
//testaa, että kategoriaa lisättäessä isot alkukirjaimet menee oikein ja välilyönnillä ei ole väliä
//testaa, että kappale voidaan poistaa
//testaa, että kappaleesta voidaan vaihtaa jokin osa oikein
//testaa, että tyhjää kappaletta ei voida lisätä
//testaa, että kategorian sisällä id:t menee kronologisesti
//
//testaa, että useamman kappaleen lisääminen onnistuu nopeasti peräkkäin
//

let token
describe('Kappaleiden lisääminen', () => {

  beforeAll(async () => {
    console.log('Kumpi tuli ensin, muna vai kana?')
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

  test('Kappaleen lisääminen onnistuu kirjautuneena käyttäjänä', async () => {
    const newKappale = {
      nimi: 'Ässät korkealla',
      alkuperäinen: 'Aces High',
      kategoria: 'Hassut laulut',
      kappaleId: 123,
      sanat: 'Elää lentääkseen, lentää elääkseen... Ässät korkealla'
    }

    const vastaus = await api
      .post('/api/kappaleet')
      .set('Authorization', `Bearer ${token}`)
      .send(newKappale)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //piti tehdä erikseen tämä, jotta jest rekisteröi kattavuuteen kys. kohdan
    expect(vastaus.statusCode).toBe(201)
  })

  test('Kappaleiden hakeminen onnistuu', async () => {

    const Kappaleet = await api
      .get('/api/kappaleet')
      .expect(200)

    expect(Kappaleet.body).not.toEqual([])
    expect(Kappaleet.body[0].nimi).toBe('Ässät korkealla')
  })

  test('Kappaleen lisääminen ei onnistu ilman kirjautumista', async () => {

    const newKappale = {
      nimi: 'askljaskjd',
      alkuperäinen: 'asdasdasd',
      kategoria: 'Hassut laulut',
      kappaleId: 1232,
      sanat: 'Elsadasdasdasdtää elääkseen... Ässät korkealla'
    }

    await api
      .post('/api/kappaleet')
      .set('Authorization', `Bearer ${'Väärä token'}`)
      .send(newKappale)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('Kappaleen lisääminen ei onnistu ilman nimeä', async () => {

    const newKappale = {
      alkuperäinen: 'asdasdasd',
      kategoria: 'Hassut laulut',
      kappaleId: 1232,
      sanat: 'Elsadasdasdasdtää elääkseen... Ässät korkealla'
    }

    await api
      .post('/api/kappaleet')
      .set('Authorization', `Bearer ${token}`)
      .send(newKappale)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('Saman kappaleen lisääminen ei onnistu', async () => {

    const newKappale = {
      nimi: 'Ässät korkealla',
      alkuperäinen: 'Aces High',
      kategoria: 'Hassut laulut',
      kappaleId: 123,
      sanat: 'Elää lentääkseen, lentää elääkseen... Ässät korkealla'
    }

    await api
      .post('/api/kappaleet')
      .set('Authorization', `Bearer ${token}`)
      .send(newKappale)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('Palvelin palauttaa 500 virheen, jos yhteyttä ei ole ', async () => {
    mongoose.connection.close()
    const newKappale = {
      nimi: 'Ässät korkealla',
      alkuperäinen: 'Aces High',
      kategoria: 'Hassut laulut',
      kappaleId: 123,
      sanat: 'Elää lentääkseen, lentää elääkseen... Ässät korkealla'
    }

    await api
      .post('/api/kappaleet')
      .set('Authorization', `Bearer ${token}`)
      .send(newKappale)
      .expect(500)
      .expect('Content-Type', /application\/json/)
  })
})
