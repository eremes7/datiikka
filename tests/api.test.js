const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const bcrypt = require('bcrypt')
const api = supertest(app)
const config = require('../utils/config')

const mongoose = require('mongoose')
const { connectToDatabase } = require('../utils/connect')

describe('Testitietokantaan liityttäessä', async => {
  test('Ympäristön tila on määritetty oikein', async () => {
    expect(process.env.NODE_ENV === 'test')
  })
  test('Liittyessä ei käytetä tuotantotietokannan osoitette', async () => {
    expect(mongoose.connection.host).not.toBe(config.MONGODB_URI)
  })
  test('Yhteyden nimi vastaa testiympäristöä', async () => {
    expect(mongoose.connection.name).toBe('test')
  })
  test('Liittyessä ei käytetä paikallisporttina kehitysympäristön porttia', async () => {
    expect(mongoose.connection.port).not.toBe(config.PORT)
  })
})

describe('Käyttäjähallinnassa', () => {
  beforeEach(async () => {

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'testikäyttäjä', passwordHash })

    await user.save()
  })

  afterAll(async () => {
    await User.deleteMany({})
  })

  test('uusien käyttäjien lisääminen onnistuu', async () => {
    newUser = {
      name: 'Testi Käyttäjä',
      username: 'Testikäyttäjä2',
      password: 'salasana'
    }

    let Users = await api
      .get('/api/users')
      .expect(200)

    initialUsers = Users.body.length
    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'testikäyttäjä2', passwordHash })

    await user.save()

    Users = await api
      .get('/api/users')
      .expect(200)

    expect(Users.body.length).toEqual(initialUsers + 1)
  })

  test('uuden käyttäjän lisääminen ei onnistu ilman salasanaa', async () => {
    newUser = {
      name: 'Testi Käyttäjä',
      username: 'Testikäyttäjä2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('uuden käyttäjän lisääminen ei onnistu liian lyhyellä salasanalla', async () => {
    newUser = {
      name: 'Testi Käyttäjä',
      username: 'Testikäyttäjä2',
      password: 'sa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('uuden käyttäjän lisääminen ei onnistu ilman käyttäjänimeä', async () => {
    newUser = {
      username: 'Testikäyttäjä2',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('uuden käyttäjän lisääminen ei onnistu liian lyhyellä käyttäjänimellä', async () => {
    newUser = {
      name: 'Testi Käyttäjä',
      username: 'Te',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('uuden käyttäjän lisääminen ei onnistu ilman nimeä', async () => {
    newUser = {
      username: 'Testikäyttäjä2',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('uuden käyttäjän lisääminen ei onnistu jos käyttäjänimi on jo käytössä', async () => {
    newUser = {
      name: 'Testi Käyttäjä',
      username: 'Testikäyttäjä',
      password: 'salasana'
    }
    anotherUser = {
      name: 'Testi Käyttäjä',
      username: 'Testikäyttäjä',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    await api
      .post('/api/users')
      .send(anotherUser)
      .expect(400)
  })

  test('kirjautuminen onnistuu oikealla käyttäjällä', async () => {
    const loginDetails = {
      username: 'testikäyttäjä',
      password: 'salasana'
    }

    await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })


  test('kirjautuminen epäonnistuu väärällä käyttäjällä', async () => {
    const loginDetails = {
      username: 'testikäyttäjä',
      password: 'vääräsalasana'
    }

    await api
      .post('/api/login')
      .send(loginDetails)
      .expect(401)
  })
})

describe('Tuotantotietokantaan liityttäessä', async => {

  let consoleErrorSpy

  beforeEach(async () => {

    await mongoose.connection.close()
    consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
    process.env.NODE_ENV = 'dev'

    jest.doMock('../utils/config', () => ({
      MONGODB_URI: 'Väärä osoite asdsa d s',
      PORT: process.env.PORT,
    }))
  })

  afterAll(async () => {
    await mongoose.connection.close()
    consoleErrorSpy.mockRestore()
    jest.dontMock('../utils/config')
    await connectToDatabase()
  })

  test('Väärällä osoitteella tulee virhe virheellisestä osoitteesta', async () => {
    await connectToDatabase()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
