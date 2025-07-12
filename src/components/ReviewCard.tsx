import { Review } from '../Interfaces'
import { User, Star, StarHalf } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  review: Review
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

const ReviewCard = ({ review }: Props) => {
  return (
    <div
      key={review.id}
      className="flex flex-row gap-5 border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
    >
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <User size={20} className="text-gray-500" />
      </div>
      <div className="flex flex-col md:flex-row justify-between w-full">
        <div className="flex flex-col justify-between mb-1">
          <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
          <div className="flex gap-1 mb-2">{renderStars(review.rating)}</div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {review.comments}
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(review.date), 'PPP • p')}
        </span>
      </div>
    </div>
  )
}

export default ReviewCard
