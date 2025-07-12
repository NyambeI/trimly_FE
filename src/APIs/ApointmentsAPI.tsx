import axios from 'axios'
import { TokenManager } from '../functions/Tokens'

export const AppointmentsAPI = {
  GetAll: (userId: number, filter: string[]) => {
    const params = new URLSearchParams()
    params.append('userId', userId.toString())
    filter.forEach((status) => params.append('status', status))

    return axios
      .get(`http://localhost:8080/appointments?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${TokenManager.getAccessToken()}`
        }
      })
      .then((response) => response.data)
  },

  NewRequest: async (
    client_id: number,
    stylist_id: number,
    service: string,
    ddate: string,
    time: string
  ) => {
    console.log({
      stylistId: stylist_id,
      clientId: client_id,
      serviceName: service,
      date: ddate,
      time: time
    })
    
    const response = await axios.post(
      'http://localhost:8080/appointments',
      {
        stylistId: stylist_id,
        clientId: client_id,
        serviceName: service,
        date: ddate,
        time: time
      },
      {
        headers: {
          Authorization: `Bearer ${TokenManager.getAccessToken()}`
        }
      }
    )
    return response.data || null
  },

  UpdateStatus: async (appointmentId: number, newStatus: string) => {
  const response = await axios.put(
    `http://localhost:8080/appointments/${appointmentId}?NewStatus=${newStatus}`,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessToken()}`
      }
    }
  )
  return response.status === 200
  }
}
