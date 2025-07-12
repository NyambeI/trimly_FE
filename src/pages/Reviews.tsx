import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { Profile, Review } from '../Interfaces'
import { TokenManager } from '../functions/Tokens'
import { Star, User } from 'lucide-react'
import { format } from 'date-fns'
import { ReviewsAPI } from '../APIs/ReviewsAPI'
import ReviewCard from '../components/ReviewCard'

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])

  const claims = TokenManager.getClaims(TokenManager.getAccessToken() as string)

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

  useEffect(() => {
    const GetReviews = async () => {
          const result = await ReviewsAPI.GetByStylist(claims?.userId as number)
          setReviews(result || null)
          console.log(result)
      }
    
      GetReviews()
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <NavBar title="Reviews" />
      <div className="p-5 mt-20">
        {reviews && reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard review={review}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
