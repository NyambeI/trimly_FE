import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import NavBar from '../components/NavBar'
import { TokenManager } from '../functions/Tokens'
import { Claims } from '../Interfaces'

const categories = [
  {
    image:
      'https://res.cloudinary.com/dny97rofq/image/upload/v1752587318/Braids_x8qty2.png',
    title: 'Haircuts'
  },
  {
    image:
      'https://res.cloudinary.com/dny97rofq/image/upload/v1752587380/HairDye_kurtdt.png',
    title: 'Colouring'
  },
  {
    image:
      'https://res.cloudinary.com/dny97rofq/image/upload/v1752587392/SilkPress_e2ovxu.png',
    title: 'Styling & Treatment'
  },
  {
    image:
      'https://res.cloudinary.com/dny97rofq/image/upload/v1752587126/Beard_ywk1je.png',
    title: 'Beard Trimming'
  }
]

export default function Home() {
  const navigate = useNavigate()

  const handleSearch = (serviceQuery: string) => {
    const params = new URLSearchParams()
    params.append('service', serviceQuery)
    navigate(`/search?${params.toString()}`)
  }
  const claims = TokenManager.getClaims(
    TokenManager.getAccessToken() as string
  ) as Claims

  return (
    <div className="flex flex-col h-full py-10 ">
      <NavBar title="Home" />

      {/* Hero Section */}
      <section className="mt-16 pb-20 bg-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect Style
            </h1>
            <p className="text-base text-gray-700 mb-6 max-w-md mx-auto md:mx-0">
              Discover top-rated hair professionals near you and book easily.
            </p>
            <div className="w-full max-w-md mx-auto md:mx-0">
              <SearchBar service="" location="" />
            </div>
          </div>
          <div className="w-full md:w-1/2 hidden md:flex justify-center">
            <img
              src="https://res.cloudinary.com/dny97rofq/image/upload/v1752563117/Promo_Image_tuvrqr.png"
              alt="Trimly Stylists"
              className="h-64 md:h-80 object-contain shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Discovery Categories */}
      <section className="w-full bg-white py-12">
        <div className="max-w-6xl  mx-auto px-4 md:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center md:text-left">
            Discover on Trimly
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleSearch(category.title)}
                className="bg-gray-50 md:p-6 rounded-xl shadow hover:bg-gray-100 transition flex flex-col"
              >
                <div className="aspect-square w-full overflow-hidden rounded-md">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 text-center flex-1 flex items-center justify-center">
                  <h3 className="text-sm md:text-base font-medium text-gray-800">
                    {category.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {claims && (
        <section className="bg-white py-6">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <Link
              to="/appointments"
              className="flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md shadow text-sm font-medium transition"
            >
              <Calendar className="h-4 w-4" />
              My Appointments
            </Link>
          </div>
        </section>
      )}

      {/* Stylist CTA */}
      <section className="bg-gray-900 text-white py-10">
        <div className=" mx-auto px-4  md:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Are You a Stylist?
            </h2>
            <p className="text-base max-w-xl">
              Join Trimly and grow your business. Get discovered by new clients
              and manage bookings seamlessly.
            </p>
          </div>
          <Link
            to="/join"
            className="inline-flex items-center h-10 bg-white text-gray-900 px-4 py-2 rounded-md shadow hover:bg-gray-100 text-sm font-medium transition"
          >
            Join Our Network
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
