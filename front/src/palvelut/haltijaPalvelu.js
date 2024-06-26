import axios from 'axios'
const baseUrl = '/api/tekstit'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log('token:', token)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token}
  }

 const response = await axios.get(baseUrl, newObject, config)
    return response.data
  }

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
  getAll, create, update, setToken
}