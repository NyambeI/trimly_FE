import { useState } from 'react'

interface props {
  service: string
  location: string
}

const SearchBar = ( {service,location}:props  ) => {
  const [serviceQuery, setServiceQuery] = useState(service)
  const [locationQuery, setLocationQuery] = useState(location)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [isDropdownVisible, setDropdownVisible] = useState(false)

  const handleLocationInput = (input: string) => {
    setLocationQuery(input)

    if (input.trim() !== '') {
      const filtered = DutchCities.filter((city) =>
        city.toLowerCase().includes(input.toLowerCase())
      )
      setFilteredSuggestions(filtered.slice(0, 6))
      setDropdownVisible(true)
    } else {
      setFilteredSuggestions([])
      setDropdownVisible(false)
    }
  }

  const handleSearch = () => {
    if (serviceQuery || locationQuery) {
      const params = new URLSearchParams()
      if (serviceQuery) params.append('service', serviceQuery)
      if (locationQuery) params.append('location', locationQuery)
      window.location.href = `/search?${params.toString()}`
    }
  }

  return (
    <div className="flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-5 grid grid-cols-1 md:grid-cols-8 gap-2">
        <input
          type="text"
          placeholder="Search service..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
          value={serviceQuery}
          onChange={(e) => setServiceQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 md:col-span-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative md:col-span-3 w-full">
          <input
            type="text"
            placeholder="Enter location"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
            value={locationQuery}
            onChange={(e) => handleLocationInput(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isDropdownVisible}
            aria-haspopup="listbox"
            role="combobox"
          />
          {isDropdownVisible && filteredSuggestions.length > 0 && (
            <ul
              className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
              role="listbox"
            >
              {filteredSuggestions.map((city, index) => (
                <li
                  key={index}
                  role="option"
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setLocationQuery(city)
                    setDropdownVisible(false)
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          onClick={handleSearch}
          className="w-full bg-gray-800  md:col-span-2 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Search
        </button>
      </div>
    </div>
  )
}

export default SearchBar

const DutchCities = [
  'Aardenburg',
  'Alkmaar',
  'Almelo',
  'Almere',
  'Amersfoort',
  'Amstelveen',
  'Amsterdam',
  'Apeldoorn',
  'Appingedam',
  'Arnemuiden',
  'Arnhem',
  'Assen',
  'Bergen op Zoom',
  'Blokzijl',
  'Bolsward',
  'Breda',
  'Bredevoort',
  'Brielle',
  'Coevorden',
  'Culemborg',
  'Delft',
  'Delfzijl',
  'Den Helder',
  'Deventer',
  'Doesburg',
  'Doetinchem',
  'Dokkum',
  'Dordrecht',
  'Echt',
  'Edam',
  'Eindhoven',
  'Enschede',
  'Franeker',
  'Goes',
  'Gorinchem',
  'Gouda',
  'Groningen',
  'Haarlem',
  'Haarlemmermeer',
  'Harderwijk',
  'Harlingen',
  'Heerlen',
  'Helmond',
  'Hengelo',
  'Hertogenbosch',
  'Hoorn',
  'Hulst',
  'IJsselstein',
  'Kampen',
  'Kerkrade',
  'Leeuwarden',
  'Leiden',
  'Lelystad',
  'Maastricht',
  'Middelburg',
  'Nijmegen',
  'Oss',
  'Purmerend',
  'Roermond',
  'Roosendaal',
  'Rotterdam',
  'Schiedam',
  'Sittard-Geleen',
  'Sneek',
  'Steenwijk',
  'Terneuzen',
  'Tiel',
  'Tilburg',
  'Utrecht',
  'Veenendaal',
  'Venlo',
  'Vlaardingen',
  'Vlissingen',
  'Weert',
  'Winschoten',
  'Woerden',
  'Zaandam',
  'Zaanstad',
  'Zaltbommel',
  'Zeist',
  'Zierikzee',
  'Zoetermeer',
  'Zutphen',
  'Zwolle'
]

