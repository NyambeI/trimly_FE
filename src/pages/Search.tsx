import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { useSearchParams } from 'react-router-dom'
import { UsersAPI } from '../APIs/UsersAPI'
import { Search as SearchIcon } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import { Profile } from '../Interfaces'
import StylistCard from '../components/StylistCard'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const service = searchParams.get('service')
  const location = searchParams.get('location')

  useEffect(() => {
    const getResults = async () => {
      try {
        setLoading(true)
        setError(null)

        if (service || location) {
          const params = new URLSearchParams()
          if (service) params.append('service', service)
          if (location) params.append('location', location)

          const response = await UsersAPI.GetSearchResults(params)
          setResults(response)
        } else {
          setResults([])
        }
      } catch (err) {
        console.error('Search failed:', err)
        setError('Failed to fetch search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    getResults()
  }, [searchParams, service, location])

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <NavBar title="Search" />
      <div className="h-screen flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 py-1">
          <div className="max-w-7xl mx-auto px-4 ">
            <div className="pt-[100px] flex flex-col items-center justify-between">
              <SearchBar service={service || ''} location={location || ''} />
              <div className="flex w-full items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {results.length}
                  </span>{' '}
                  stylists found
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for stylists...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 rounded-xl p-8 max-w-md mx-auto">
                <div className="text-red-600 mb-4">
                  <SearchIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Search Error
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-6">
              {results.map((result, index) => (
                <div
                  key={result.user.id || index}
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <StylistCard
                    displayName={result.user.displayName}
                    city={result.user.city}
                    rating={result.user.rating}
                    profilePicture={result.profilePicture}
                    styleImages={result.styleImages}
                  />
                </div>
              ))}
              {results.length >= 20 && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => {
                      // Plug pagination logic here
                      alert('Pagination not implemented yet')
                    }}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Load More Results
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center h-full py-16 mb-6">
              <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <SearchIcon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No stylists found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any stylists matching your search criteria.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
