import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Image } from '../Interfaces'
import { User, Star, StarHalf } from 'lucide-react'
import { ImagesAPI } from '../APIs/ImagesAPI'

interface Props {
  displayName: string
  city: string
  rating: number
  profilePicture:Image|null
  styleImages:Image[]
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div
      className="flex items-center space-x-1"
      title={`${rating.toFixed(1)} out of 5`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  )
}

const StylistCard = ({displayName, city, rating, styleImages, profilePicture }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % styleImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + styleImages.length) % styleImages.length)
  }


  return (
    <div className="w-full p-2">
      <a
        type="StylistCard"
        href={`/stylists/${displayName}`}
        className="flex flex-col md:flex-row gap-4 p-4 border border-gray-300 rounded-lg m-2 hover:shadow transition"
      >
        {/* Image Carousel */}
        <div className="relative flex-shrink-0 w-full md:w-80 h-40 md:h-48 rounded-lg overflow-hidden">
          {styleImages.length > 0 && (
            <>
              <img
                src={styleImages[currentIndex].url}
                alt={`Slide ${currentIndex + 1}`}
                className="h-full w-full object-cover object-center rounded-lg transition-all duration-500"
              />
              {styleImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      prevSlide()
                    }}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      nextSlide()
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-1 items-start gap-4">
          {profilePicture ? (
            <img
              src={profilePicture.url}
              alt="Profile"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full text-gray-500">
              <User className="w-6 h-6" />
            </div>
          )}

          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-sm text-gray-500">{city}</p>
            {renderStars(rating)}
          </div>
        </div>
      </a>
    </div>
  )
}

export default StylistCard
