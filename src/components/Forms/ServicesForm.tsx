import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Service } from '../../Interfaces'
import AccountOptions from '../AccountOptions'
import NavBar from '../NavBar'
import { ServicesAPI } from '../../APIs/ServicesAPI'
import { TokenManager } from '../../functions/Tokens'

const UserID = TokenManager.getClaims(TokenManager.getAccessToken() as string)
  ?.userId as number

export default function ServicesForm() {
  const [services, setServices] = useState<Service[]>([])
  const categories = [
    'Haircut',
    'Coloring',
    'Styling & Treatment',
    'Beard Trimming'
  ]

  const [serviceName, setServiceName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')

  const Add = async () => {
    if (serviceName && duration && price) {
      try {
        await ServicesAPI.AddService(UserID, selectedCategory, serviceName, duration, price)

        const newService: Service = {
          name: serviceName,
          category: selectedCategory,
          duration: duration,
          price: price
        }

        const updatedServices = [...services, newService]
        setServices(updatedServices)

        setServiceName('')
        setDuration('')
        setPrice('')
      } catch {}
    }
  }

  const deleteService = async (name: string) => {
    try {
      setServices(services.filter((service) => service.name !== name))
      await ServicesAPI.DeleteService(UserID, name)
    } catch {}
  }

  useEffect(() => {
    const fetchServices = async () => {
      const userData = await ServicesAPI.GetServices(UserID)
      if (userData) {
        console.log(userData)
        setServices(userData)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="bg-white p-5 rounded-lg w-full ">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-10 ">
        <div className=" w-full mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="service"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (€)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={Add}
            className="w-full sm:col-span-2 h-10 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Service
          </button>
        </div>

        {services.length > 0 && (
          <div>
            <ul className="space-y-3 p-5 h-[300px] bg-gray-200 overflow-auto">
              {services.map((service) => (
                <li
                  key={service.name}
                  className="flex items-center justify-between rounded-md bg-gray-50 p-4 border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-800">{service.name}</p>
                    <p className="text-sm text-gray-600">
                      {service.duration} minutes | €{service.price}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteService(service.name)}
                    className="text-gray-400 hover:text-red-600 focus:outline-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
