

const LisääTeksti = () => {
  return (
    <div>
      <h2>Lisää teksti</h2>
      <form>
        <div>
          <label htmlFor="otsikko">Otsikko</label>
          <input type="text" id="otsikko" name="otsikko" />
        </div>
        <div>
          <label htmlFor="teksti">Teksti</label>
          <textarea id="teksti" name="teksti" />
        </div>
        <button type="submit">Lisää</button>
      </form>
    </div>
  )
}


export default LisääTeksti