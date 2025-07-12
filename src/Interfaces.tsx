export interface user {
  id: number
  firstName: string
  lastName: string
  email: string
  displayName: string
  about: string
  city: string
  rating: number
}

export interface Profile {
  user: user
  profilePicture: Image | null
  styleImages: Image[]
  reviews: Review[]
  services: Service[]
}

export interface Appointment {
  id: number
  client: user
  date: Date
  startTime: string
  status: string
  totalDuration: string
  service: Service
}

export interface Service {
  name: string
  category: string
  duration: string
  price: string
}

export interface Review {
  id: number
  clientName: string
  rating: number
  date: string
  comments: string
}

export interface Claims {
  sub: string
  iat: number
  exp: number
  roles: string[]
  userId: number
}

export interface Image {
  id: string
  url: string
}

export interface Notification {
  to?: number | string
  text: string
}
