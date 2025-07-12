import { Navigate, Route } from 'react-router-dom'
import { TokenManager } from '../functions/Tokens'

interface Props {
  roles: string[]
  page: React.ReactNode
}

export const ProtectedRoute: React.FC<Props> = ({ roles, page }) => {
  const token = TokenManager.getAccessToken()
  if (!token) return <Navigate to="/login" />

  const userRoles = TokenManager.getClaims(token)?.roles
  if (!userRoles || !roles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/login" />
  }

  return <>{page}</>
}
