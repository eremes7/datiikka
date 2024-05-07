const config = require('../utils/config') // Muuta polkua tarvittaessa

module.exports = async function globalTeardown() {
  if (config.Memory) {
    const instance = global.__MONGOINSTANCE
    await instance.stop()
  }
}