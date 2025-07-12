import { useParams } from 'react-router-dom'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Image, Profile, Review, Service } from '../Interfaces'
import NavBar from '../components/NavBar'
import { User, Star, Calendar, X, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { TokenManager } from '../functions/Tokens'
import { AppointmentsAPI } from '../APIs/ApointmentsAPI'
import sendNotification from '../functions/SendNotifcation'
import { useStomp } from '../functions/StompProvider'
import { UsersAPI } from '../APIs/UsersAPI'
import { toast } from 'react-toastify'
import ReviewCard from '../components/ReviewCard'

const claims = TokenManager.getClaims(TokenManager.getAccessToken() as string)

export function Stylist_Profile() {
  const { displayName } = useParams()
  const decodedDisplayName = useMemo(
    () => decodeURIComponent(displayName || ''),
    [displayName]
  )

  const [profile, setProfile] = useState<Profile | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showSuccessModal, setshowSuccessModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [SelectedDate, setselectedDate] = useState('')
  const [SelectedTime, setselectedTime] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const client = useStomp()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!decodedDisplayName) return
      console.log(decodedDisplayName)

      const profileData = await UsersAPI.GetByDisplayName(decodedDisplayName)
      console.log("data is "+profileData)
      if (profileData==null) {
        toast.error('Stylist not found')
      }

      setProfile(profileData)

      if (profileData.services.length > 0) {
        setSelectedService(profileData.services[0].name)
      }
    }
    fetchProfileData()
  }, [decodedDisplayName])

  const handleBookNow = () => {
    claims != null
      ? claims.roles.includes('CLIENT') && setShowBookingModal(true)
      : (window.location.href = '/login')
  }

  const handleCloseModal = () => {
    setErrorMsg('')
    setShowBookingModal(false)
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !claims) return
    console.log('selected' + selectedService)
    try {
      const response = await AppointmentsAPI.NewRequest(
        claims.userId as number,
        profile.user.id as number,
        selectedService as string,
        SelectedDate,
        SelectedTime
      )
      if (response) {
        setErrorMsg(response)
        return
      }
      sendNotification(client, {
        to: profile.user.id,
        text: 'You have a new appointment request'
      })
      setErrorMsg('')
      setShowBookingModal(false)
      setshowSuccessModal(true)
    } catch (error) {
      console.error('Error submitting booking:', error)
      setErrorMsg('Failed to submit booking request')
    }
  }

  const renderStars = (rating: number = 0) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      )
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )
    }
    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      )
    }
    return stars
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-50">
        <NavBar title="Stylist" />
        <div className="flex-1 flex items-center justify-center text-gray-600">
          Stylist not found.
        </div>
      </div>
    )
  }

  const servicesDisplay = profile?.services?.map((s) => (
    <span key={s.name} className="bg-gray-200 px-3 py-1 rounded-full">
      {s.name}
    </span>
  ))

  const imagesGrid = profile.styleImages.length > 0 && (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {profile.styleImages?.map((img, i) => (
          <img
            key={img.url || i}
            src={img.url}
            alt={`Style ${i + 1}`}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )

  

  if (!profile) {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-50">
        <NavBar title="Stylist" />
        <div className="flex-1 flex items-center justify-center text-gray-600">
          Stylist not found.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-screen">
      <NavBar title="Stylist" />
      <div className="pt-[120px] p-10 flex flex-col lg:flex-row items-start gap-8">
        <div className="flex flex-col w-full gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture.url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
                loading="eager"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">
                <User size={48} />
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between text-center md:text-left flex-1">
              <div>
                <h1 className="text-2xl font-semibold">
                  {profile.user.displayName}
                </h1>
                <p className="text-gray-600">{profile.user.city}</p>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(profile.user.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {profile.user.rating} ({profile.reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
                >
                  <Calendar size={20} />
                  Book Now
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600">
            <p className="font-bold text-md px-3 py-1">Services:</p>
            {servicesDisplay}
          </div>

          {imagesGrid}

          {profile.user.about && (
            <div className="w-full bg-white rounded-xl shadow p-6  lg:top-32">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <span className="text-gray-700 whitespace-pre-line">
                {profile.user.about}
              </span>
            </div>
          )}

          {profile.reviews && profile.reviews.length > 0 && (
            <div className=" bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-6">
                {profile.reviews.map((review) => (
                  <ReviewCard review={review} />
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Book Appointment
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <X className="w-3 h-3" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleSubmitBooking} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="date"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      min={new Date().toISOString().split('T')[0]}
                      id="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                      required
                      onChange={(e) => setselectedDate(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="time"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      onChange={(e) => setselectedTime(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="service"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Service
                    </label>
                    <select
                      id="service"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      {profile.services.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{errorMsg}</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="text-white inline-flex items-center p-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Send request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-4">
              Appointment request sent successfully!
            </p>
            <button
              onClick={() => setshowSuccessModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
