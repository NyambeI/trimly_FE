import axios from 'axios'
import { TokenManager } from '../functions/Tokens'

export const ServicesAPI = {
  AddService: async (
    stylistID: number,
    category: string,
    name: string,
    duration: string,
    price: string
  ) => {
    console.log({ stylistID, category, name, duration, price })
    await axios.post(
      `http://localhost:8080/services`,
      { stylistId: stylistID, category, name, duration, price },
      {
        headers: {
          Authorization: `Bearer ${TokenManager.getAccessToken()}`
        }
      }
    )
  },

  DeleteService: async (StylistID: number, name: string) => {
    const response = await axios.delete(`http://localhost:8080/services`, {
      data: { stylistId: StylistID, name },
      headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
    })

    return response.data ?? null
  },

  GetServices: async (StylistId: number) => {
    const response = await axios.get(`http://localhost:8080/services`, {
      params: { StylistId },
      headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
    })

    return response.data ?? null
  }
}
