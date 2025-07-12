import React, { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'
import AccountOptions from '../AccountOptions'
import NavBar from '../NavBar'
import { ImagesAPI } from '../../APIs/ImagesAPI'
import { TokenManager } from '../../functions/Tokens'
import { Image } from '../../Interfaces'

const ImagesForm: React.FC = () => {
  const [images, setImages] = useState<Image[]>([])
  const UserID = TokenManager.getClaims(TokenManager.getAccessToken() as string)
    ?.userId as number

  const CLOUDINARY_URL =
    'https://api.cloudinary.com/v1_1/dny97rofq/image/upload'
  const CLOUDINARY_UPLOAD_PRESET = 'Trimly'

  const UploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const selectedImages = Array.from(event.target.files)

    for (const image of selectedImages) {
      try {
        console.log(image)
        const response = (await ImagesAPI.UploadImage(
          UserID,
          'style',
          image
        )) as Image
        setImages((prevImages) => [...prevImages, response])
      } catch (error) {
        console.error('Failed to upload image:', error)
      }
    }
  }

  const DeleteImage = async (id: string) => {
    await ImagesAPI.DeleteImage(id)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const GetImages = async () => {
    const response = (await ImagesAPI.GetImages(UserID, 'style')) as Image[]
    setImages(response)
  }

  useEffect(() => {
    GetImages()
  }, [UserID])

  return (
    <div className="bg-white p-6 rounded-lg w-full ">
      {/* File Input */}
      <div className="mb-6 w-100">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-200">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                Click to upload
              </span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={UploadImage}
            className="hidden"
          />
        </label>
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Uploaded Images ({images.length})
      </h3>
      {images.length > 0 && (
        <div className="mb-8 max-h-[300px] overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={image.url}
                  alt={`Preview ${index}`}
                  className="w-full h-44 object-cover object-center"
                />
                <button
                  onClick={() => DeleteImage(image.id)}
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImagesForm
