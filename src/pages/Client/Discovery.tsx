import { Calendar } from 'lucide-react'
import NavBar from '../../components/NavBar'
import { TokenManager } from '../../functions/Tokens'
import { Claims } from '../../Interfaces'
import SearchBar from '../../components/SearchBar'

export default function Discovery() {
  const categories = [
    { image: 'assets/Styles/Braids.png', title: 'Haircut' },
    { image: 'assets/Styles/HairDye.png', title: 'Colouring' },
    { image: 'assets/Styles/SilkPress.png', title: 'Styling & Treatment' },
    { image: 'assets/Styles/Beard.png', title: 'Beard Trimming' }
  ]

  const claims = TokenManager.getClaims(
    TokenManager.getAccessToken() as string
  ) as Claims

  const handleSearch = (serviceQuery: string) => {
    const params = new URLSearchParams()
    params.append('service', serviceQuery)
    window.location.href = `/search?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-6 h-full w-full bg-gray-100">
      <NavBar title="Discovery" />
      <div className="flex-1 px-6 md:px-20 pt-[60px]">
        <SearchBar service="" location="" />
        <div className="bg-white md:p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <a
                onClick={(e) => handleSearch(category.title)}
                key={index}
                className="bg-gray-50 md:p-10 shadow-md rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex flex-col"
              >
                <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex items-center justify-center flex-1">
                  <h3 className="text-sm md:text-md font-semibold text-gray-800">
                    {category.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 px-8 shadow">
        <a
          href="/appointments"
          className="flex items-center text-white hover:text-black font-semibold gap-3 w-full items-center  self-center p-3  bg-gray-800 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          My Appointments
        </a>
      </div>
    </div>
  )
}
