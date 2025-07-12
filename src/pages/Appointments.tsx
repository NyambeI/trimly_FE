import { Calendar, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { AppointmentsAPI } from '../APIs/ApointmentsAPI'
import { TokenManager } from '../functions/Tokens'
import { Claims } from '../Interfaces'
import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { ReviewsAPI } from '../APIs/ReviewsAPI'
import sendNotification from '../functions/SendNotifcation'
import { useStomp } from '../functions/StompProvider'
import { toast } from 'react-toastify'

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED'
  ])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  
  const client = useStomp()

  const claims = TokenManager.getClaims(
    TokenManager.getAccessToken() as string
  ) as Claims

  const fetchAppointments = async (id: number) => {
    try{
    const response = await AppointmentsAPI.GetAll(id, selectedStatus)
    setAppointments(response)}catch{toast.error('somethign went wrong')}
  }

  useEffect(() => {
    fetchAppointments(claims.userId)
  
  }, [claims.userId, selectedStatus])

  const updateStatus = async (appointment: any, newStatus: string, notificationMsg: string) => {
    await AppointmentsAPI.UpdateStatus(appointment.id, newStatus)
    fetchAppointments(claims.userId)
    
    let To = claims.roles.includes('CLIENT')
      ? appointment.stylist.id
      : appointment.client.id
    
    sendNotification(client, {
          to: To,
          text: notificationMsg
        })
  }

  const switchAppointments = (newStatus: string[]) => {
    setSelectedStatus(newStatus)
  }

  const handleCloseModal = () => {
    setShowReviewModal(false)
    setSelectedAppointment(null)
    setRating(5)
    setReviewText('')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await ReviewsAPI.submitReview(selectedAppointment.id, rating, reviewText )
      console.log('Submitting review:', {
        appointmentId: selectedAppointment.id,
        rating,
        reviewText
      })
      handleCloseModal()
      fetchAppointments(claims.userId)
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; dot: string; label: string }
    > = {
      confirmed: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Confirmed'
      },
      pending: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        dot: 'bg-amber-500',
        label: 'Pending'
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        dot: 'bg-blue-500',
        label: 'Completed'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500',
        label: 'Cancelled'
      },
      rejected: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500',
        label: 'Rejected'
      }
    }

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
        {config.label}
      </div>
    )
  }

  const getButtonStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
      case 'pending':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg'
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg'
      case 'rejected':
        return 'bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 shadow-md hover:shadow-lg'
      default:
        return 'bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700 shadow-md hover:shadow-lg'
    }
  }

  const getAppointmentActions = (appointment: any) => {
    const requestOptions = (
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <button
          className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-colors"
          title="Accept"
          onClick={() =>
            updateStatus(
              appointment,
              'CONFIRMED',
              `Your appointment request has been Accepted`
            )
          }
        >
          <Check className="h-5 w-5 text-white mx-auto" />
        </button>
        <button
          className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
          title="Reject"
          onClick={() =>
            updateStatus(
              appointment,
              'REJECTED',
              `Your appointment request with ${appointment.stylist.displayName}, was Rejected`
            )
          }
        >
          <X className="h-5 w-5 text-white mx-auto" />
        </button>
      </div>
    )

    const confirmedOptions = (
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        {claims.roles.includes('STYLIST') && (
          <button
            className="w-[150px] h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
            title="Complete"
            onClick={() =>
              updateStatus(
                appointment,
                'COMPLETED',
                `Please write a review for your appointment with ${appointment.stylist.displayName}`
              )
            }
          >
            Mark as Completed
          </button>
        )}
        <button
          className="w-[100px] h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
          title="Cancel"
          onClick={() =>
            updateStatus(
              appointment,
              'CANCELLED',
              claims.roles.includes('CLIENT')
                ? `${appointment.client.firstName} ${appointment.client.lastName} cancelled the Appointment`
                : `Your appointment with ${appointment.stylist.displayName} was Cancelled`
            )
          }
        >
          Cancel
        </button>
      </div>
    )

    // Fixed: Proper button element instead of anchor tag
    const WriteReviewButton = (
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <button
          className="w-[150px] h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
          title="Write Review"
          onClick={() => {
            setSelectedAppointment(appointment)
            setShowReviewModal(true)
          }}
        >
          Write a review
        </button>
      </div>
    )

    if (claims.roles.includes('STYLIST')) {
      if (appointment.status === 'PENDING') {
        return requestOptions
      } else if (appointment.status === 'CONFIRMED') {
        return confirmedOptions
      }
    }
    if (claims.roles.includes('CLIENT')) {
      console.log(appointment.status)
      if (appointment.status === 'CONFIRMED') {
        return confirmedOptions
      } else if (
        appointment.status === 'COMPLETED' &&
        appointment.review === null
      ) {
        return WriteReviewButton
      }
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <NavBar title="Appointments" />
      <div className="p-5 mt-20">
        <div className="flex gap-2 mb-5">
          <button
            className={`w-[200px] h-10 rounded-lg transition duration-200 shadow-sm ${
              selectedStatus.includes('CONFIRMED')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300'
            }`}
            onClick={() =>
              switchAppointments(['CONFIRMED', 'CANCELLED', 'COMPLETED'])
            }
          >
            Appointments
          </button>
          <button
            className={`w-[100px] h-10 rounded-lg transition duration-200 shadow-sm ${
              selectedStatus.includes('PENDING')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300'
            }`}
            onClick={() => switchAppointments(['PENDING', 'REJECTED'])}
          >
            Requests
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="space-y-3 overflow-y-auto pr-1">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                No appointments
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-md p-4 hover:shadow transition"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      {claims.roles.includes('CLIENT') ? (
                        <h3 className="font-semibold mb-1">
                          {appointment.stylist.displayName}
                        </h3>
                      ) : (
                        <h3 className="font-semibold mb-1">
                          {appointment.client.firstName}{' '}
                          {appointment.client.lastName}
                        </h3>
                      )}

                      <p className="text-sm text-gray-600">
                        {appointment.serviceName}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(appointment.start), 'PPP • p')}
                        </span>
                      </div>
                      <div className="mt-2">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>

                    {getAppointmentActions(appointment)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed: Review Modal with proper content */}
      {showReviewModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Write Review
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
              <form onSubmit={handleSubmitReview} className="p-4 md:p-5">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Review for:{' '}
                    <strong>
                      {selectedAppointment.stylist.displayName}
                    </strong>
                    <br />
                    Service: <strong>{selectedAppointment.serviceName}</strong>
                  </p>

                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 mb-4"
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>

                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    rows={4}
                    placeholder="Share your experience..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
