import {
  ChevronRight,
  LucideAlertCircle,
  Calendar,
  Star,
  User,
  Clock,
  Check,
  X,
  Clock1
} from 'lucide-react'
import { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar'
import { TokenManager } from '../../functions/Tokens'
import { Appointment, Claims } from '../../Interfaces'
import { AppointmentsAPI } from '../../APIs/ApointmentsAPI'
import { UsersAPI } from '../../APIs/UsersAPI'

export default function Dashboard() {
  const claims = TokenManager.getClaims(
    TokenManager.getAccessToken() as string
  ) as Claims
  const [actionRequired, setActionRequired] = useState<string[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  const fetchActionRequired = async (id: number) => {
    const response = await UsersAPI.ActionRequired(id)
    setActionRequired(response)
  }
  const fetchUpcomingAppointments = async (id: number) => {
    const response = await AppointmentsAPI.GetAll(id, ['CONFIRMED'])
    setAppointments(response)
  }
  useEffect(() => {
    fetchActionRequired(claims.userId)
    fetchUpcomingAppointments(claims.userId)
  }, [claims.userId])

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <NavBar title="Dashboard" />
      <br />
      <br />
      <br />
      <main className="container mx-auto px-8 py-8 space-y-10 ">
        {actionRequired.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-2">
              <LucideAlertCircle className="text-yellow-600 h-5 w-5 mt-1" />
              <div>
                <p className="font-medium text-yellow-800 text-sm">
                  Action Required: Complete Your Account Setup
                </p>
                <p className="text-xs text-yellow-700">
                  {actionRequired.join(', ')}
                </p>
              </div>
            </div>
            <a
              href="/profile"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm rounded-md text-center"
            >
              Setup
            </a>
          </div>
        )}

        <div className="bg-gray-200 rounded-lg shadow p-5">
          <div className=" flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-5">
              <a
                href="/appointments"
                className="flex items-center w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </div>
              </a>
              <a
                href="/reviews"
                className="flex items-center w-full justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Clock1 className="h-4 w-4" />
                  Work hours
                </div>
              </a>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <a
                href="/reviews"
                className="flex items-center w-full justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Reviews
                </div>
              </a>
              <a
                href="/profile"
                className="flex items-center w-full justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  My Profile
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
