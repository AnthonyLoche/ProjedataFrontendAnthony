import axios from 'axios'
let apiUrl = import.meta.env.VITE_API_URL
if (apiUrl == undefined) {
  apiUrl = 'http://localhost:8080/'
}

const api = axios.create({
  baseURL: apiUrl,
})

export default api
