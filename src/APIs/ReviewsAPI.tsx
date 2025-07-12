import axios from 'axios'
import { TokenManager } from '../functions/Tokens'

export const ReviewsAPI = {
  GetByStylist: (userId: number) => {
    const params = new URLSearchParams()
    params.append('userId', userId.toString())

    return axios
      .get(`http://localhost:8080/reviews?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${TokenManager.getAccessToken()}`
        }
      })
      .then((response) => response.data)
  },

  submitReview: async (
    Appoinment_id: number,
    rating: number,
    comment: string
  ) => {
    const response = await axios.post(
      'http://localhost:8080/reviews',
      {
        appointmentId: Appoinment_id,
        rating: rating,
        comment: comment
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
