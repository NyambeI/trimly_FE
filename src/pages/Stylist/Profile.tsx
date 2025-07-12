import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar'
import { UsersAPI } from '../../APIs/UsersAPI'
import { TokenManager } from '../../functions/Tokens'
import { Image } from '../../Interfaces'
import { ImagesAPI } from '../../APIs/ImagesAPI'
import ImagesForm from '../../components/Forms/ImagesForm'
import ServicesForm from '../../components/Forms/ServicesForm'
import { Link, User } from 'lucide-react'
import { toast } from 'react-toastify'

export function Profile() {
  const [displayName, setDisplayName] = useState('')
  const [city, setCity] = useState('')
  const [about, setAbout] = useState('')
  const [profilePicture, setProfilePicture] = useState<Image | null>(null)
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const userID = TokenManager.getClaims(TokenManager.getAccessToken() as string)
    ?.userId as number

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file')
        return
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setErrorMessage('Image size must be less than 5MB')
        return
      }

      setNewProfilePicture(file)
      setErrorMessage('')
      setSuccessMessage('')
    }
  }

  const clearProfilePicture = async () => {
    try {
      if (profilePicture) {
        await ImagesAPI.DeleteImage(profilePicture.id)
        setProfilePicture(null)
      }
      setNewProfilePicture(null)
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }

      setErrorMessage('')
      setSuccessMessage('Profile picture removed successfully')
    } catch (error) {
      console.error('Error clearing profile picture:', error)
      setErrorMessage('Failed to remove profile picture')
    }
  }

  const fetchUserData = async () => {
    if (!userID) return
    try {
      const basicInfo = await UsersAPI.GetUser(userID)
      console.log(basicInfo)
      if (basicInfo) {
        setDisplayName(basicInfo.displayName || '')
        setCity(basicInfo.city || '')
        setAbout(basicInfo.about || '')
      }

      const profilePic = await ImagesAPI.GetImages(userID, 'profile picture')
      if (profilePic && profilePic.length > 0) {
        setProfilePicture(profilePic[0])
      } else {
        setProfilePicture(null)
      }
    }  catch (error) {
      toast.error(`Error fetching user data: ${error instanceof Error ? error.message : String(error)}`);
    }
    
  }

  useEffect(() => {
    fetchUserData()
  }, [userID])

  const handleSubmit = async () => {
    if (!userID) return

    setErrorMessage('')
    setSuccessMessage('')

    try {
      if (newProfilePicture) {
        if (profilePicture) {
          await ImagesAPI.DeleteImage(profilePicture.id)
        }

        // Upload new profile picture
        const uploadedImage = await ImagesAPI.UploadImage(
          userID,
          'profile picture',
          newProfilePicture
        )

        if (uploadedImage) {
          setProfilePicture(uploadedImage)
          setNewProfilePicture(null)

          const fileInput = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement
          if (fileInput) {
            fileInput.value = ''
          }
        }
      }

      const response = await UsersAPI.Update(
        userID,
        null,null,null,
        displayName,
        city,
        about
      )

      if (response) {
        setErrorMessage(response)
        return
      }

      setSuccessMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage('Failed to update profile. Please try again.')
    }
  }

  const resetForm = () => {
    fetchUserData()
    setNewProfilePicture(null)
    setErrorMessage('')
    setSuccessMessage('')
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="w-full h-screen ">
      <NavBar title="Profile" />

      <div className="container w-full h-full overflow-auto mx-auto px-4 p-20">
        <div className="flex justify-center w-full  mt-8">
          <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">
                This information will publicly available for everyone to see
              </p>
            </div>
            {errorMessage == 'Failed to update profile. Please try again.' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  maxLength={30}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your display name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    {newProfilePicture ? (
                      <img
                        src={URL.createObjectURL(newProfilePicture)}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                    ) : profilePicture ? (
                      <img
                        src={profilePicture.url}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full text-gray-500 text-xs">
                        <User />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <label className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 text-sm">
                        Choose Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      {(profilePicture || newProfilePicture) && (
                        <button
                          type="button"
                          onClick={clearProfilePicture}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style Images
                </label>
                <ImagesForm />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>
                <ServicesForm />
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
