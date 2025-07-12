import axios from 'axios'
import { TokenManager } from '../functions/Tokens'

export const UsersAPI = {
  GetUser: (Id: number) =>
    axios
      .get(`http://localhost:8080/users/${Id}`, {
        headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
      })
      .then((response) => response.data),


  login: async (email: string, password: string) => {
    const response = await axios.post('http://localhost:8080/users/login', {
      email,
      password
    })

    if (response.data?.token) {
      TokenManager.setAccessToken(response.data.token)
      window.location.href = '/'
    } else {
      return response.data?.errorMessage
    }
  },

  Signup: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) => {
    const response = await axios.post('http://localhost:8080/users/signup', {
      firstName,
      lastName,
      email,
      role,
      password
    })

    if (response.data?.token) {
      TokenManager.setAccessToken(response.data.token)
      window.location.href = '/'
    } else {
      return response.data?.errorMessage
    }
  },

  Update: async (
    id: number,
    firstName: string | null,
    lastName: string | null,
    password: string | null,
    displayName: string | null,
    city: string | null,
    about: string | null
  ) => {
    const response = await axios.put(
      `http://localhost:8080/users/${id}`,
      { firstName, lastName, password, displayName, city, about },
      {
        headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
      }
    )
    return response.data ?? null
  },

  ActionRequired: async (id: number) => {
    const response = await axios.get(
      `http://localhost:8080/users/${id}/action-required`,
      {
        headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
      }
    )
    return response.data ? response.data : null
  },

  GetByDisplayName: (name: string) =>
    axios
      .get(`http://localhost:8080/users/get-by-name/${name}`, {
        headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
      })
      .then((response) => response.data),

  GetSearchResults: (params: URLSearchParams) =>
    axios
      .get(`http://localhost:8080/users/search?${params.toString()}`)
      .then((response) => response.data)
}
