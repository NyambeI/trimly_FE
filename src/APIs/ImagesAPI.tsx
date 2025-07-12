import axios from 'axios'
import { TokenManager } from '../functions/Tokens'

export const ImagesAPI = {
  GetImages: async (stylistId: number, type: string) => {
    const response = await axios.get(`http://localhost:8080/images`, {
      params: { StylistId: stylistId, Type: type }
    })
    return response.data ?? null
  },

  UploadImage: async (StylistID: number, type: String, Image: File) => {
    const formData = new FormData()
    formData.append('stylistId', StylistID.toString())
    formData.append('type', type.toString())
    formData.append('image', Image)

    console.log(Image)

    const response = await axios.post(
      `http://localhost:8080/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${TokenManager.getAccessToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data ?? null
  },

  DeleteImage: async (id: string) => {
    const response = await axios.delete(`http://localhost:8080/images/${id}`, {
      headers: { Authorization: `Bearer ${TokenManager.getAccessToken()}` }
    })
    return response.data ?? null
  }
}
