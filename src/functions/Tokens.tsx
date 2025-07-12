import { jwtDecode } from 'jwt-decode'
import { Claims } from '../Interfaces'

export const TokenManager = {
  getAccessToken(): string | null {
    const token = localStorage.getItem('token')
    if (!token || this.isExpired(token)) {
      localStorage.removeItem('token')
      return null
    }
    return token
  },

  getClaims(token: string): Claims | undefined {
    if (!token) return undefined

    return jwtDecode<Claims>(token)
  },

  setAccessToken(token: string): void {
    localStorage.setItem('token', token)
  },

  isExpired(token: string): boolean {
    const claims = this.getClaims(token)
    if (!claims) return true

    const currentTimestamp = Math.floor(Date.now() / 1000)
    return currentTimestamp >= claims.exp
  },
  Logout () {
    localStorage.removeItem('token')
    window.location.href = '/'
  }
}
