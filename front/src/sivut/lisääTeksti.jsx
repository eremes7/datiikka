import React, { useState } from 'react'
import axios from 'axios'

const LisääTeksti = () => {
  const [otsikko, setOtsikko] = useState('')
  const [avain, setAvain] = useState('')
  const [kategoria, setKategoria] = useState('')
  const [sisältö, setSisältö] = useState('')

  const handleLisäys = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/tekstit', {
        otsikko,
        avain,
        kategoria,
        sisältö
      })
    console.log('Vastaus palvelimelta:', response.data)
      } catch (error) {
        console.error('Virhe POST-pyynnössä:', error)
      }
  }

  return (
    <div>
      <h2>Lisää teksti</h2>
      <form onSubmit={handleLisäys}>
        <div>
          Otsikko
          <input
            type="text"
            value={otsikko}
            name="Otsikko"
            onChange={({ target }) => setOtsikko(target.value)}
          />
        </div>
        <div>
          Avain
          <input
            type="text"
            value={avain}
            name="Avain"
            onChange={({ target }) => setAvain(target.value)}
          />
        </div>
        <div>
          Kategoria
          <input
            type="text"
            value={kategoria}
            name="Kategoria"
            onChange={({ target }) => setKategoria(target.value)}
          />
        </div>
        <div>
          Sisältö
          <input
            type="text"
            value={sisältö}
            name="Sisältö"
            onChange={({ target }) => setSisältö(target.value)}
          />
        </div>
        <button type="submit">Lisää teksti</button>
      </form>
    </div>    


  )
}


export default LisääTeksti