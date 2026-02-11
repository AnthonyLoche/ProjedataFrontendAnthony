import axios from 'axios'
// import { showMessage } from '@/utils/toastfy'

let apiUrl = import.meta.env.VITE_API_URL
if (apiUrl == undefined) {
  apiUrl = 'http://localhost:8080/'
}

const api = axios.create({
  baseURL: apiUrl,
})

// const accessToken = JSON.parse(
//   localStorage.getItem("authState") || "{}"
// ).accessToken;

// if (accessToken) {
//   api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
// }

// api.interceptors.response.use(
//   response => {
//     return response
//   },
//   async error => {
//     console.error('Erro no interceptor:', error)
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const refreshToken = localStorage.getItem('authState') ? JSON.parse(localStorage.getItem('authState')).refreshToken : null
//         if (!refreshToken) {
//           throw new Error('Refresh token ausente')
//         }

//         const { data } = await api.post('token/refresh/', {
//           refresh: refreshToken,
//         })

//         const newAccessToken = data.access
//         const authState = JSON.parse(localStorage.getItem('authState')) || {}
//         authState.accessToken = newAccessToken
//         localStorage.setItem('authState', JSON.stringify(authState))
//         api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

//         return api(originalRequest)
//       } catch (refreshError) {
//         localStorage.removeItem('access_token')
//         localStorage.removeItem('refresh_token')
//         delete api.defaults.headers.common['Authorization']
//         window.location.href = '/blank/login'
//         return Promise.reject(refreshError)
//       } finally {
//         alert('Sua sessão expirou, faça login novamente.')
//       }
//     }
//     throw error
//   },
// )

export default api
