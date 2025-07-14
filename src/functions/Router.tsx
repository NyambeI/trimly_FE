import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Signup from '../pages/Signup'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { TokenManager } from './Tokens'
import PersonalDetailsForm from '../pages/Personal_Details'
import Discovery from '../pages/Client/Discovery'
import Dashboard from '../pages/Stylist/Dashboard'
import ChangePassword from '../pages/Change_Password'
import { Profile } from '../pages/Stylist/Profile'
import { Stylist_Profile } from '../pages/Stylist_Profile'
import Appointments from '../pages/Appointments'
import { Reviews } from '../pages/Reviews'
import { ToastContainer } from 'react-toastify'
import SignIn from '../pages/Login'
import Loginn from '../pages/Loginn'

const GetHomePageByRole = () => {
  const Role = TokenManager.getClaims(TokenManager.getAccessToken() as string)
    ?.roles[0]
  if (Role == 'STYLIST') {
    return <Dashboard />
  }
  return <Discovery />
}

const AppRoutes = () => {
  const isAuthenticated = !!TokenManager.getAccessToken()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ProtectedRoute
                  roles={['STYLIST', 'CLIENT']}
                  page={GetHomePageByRole()}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/Login" element={<Loginn />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stylists/:displayName" element={<Stylist_Profile />} />
          <Route path="/join" element={<Signup role="STYLIST" />} />
          <Route path="/signup" element={<Signup role="CLIENT" />} />
          <Route
            path="/personalInformation"
            element={
              <ProtectedRoute
                roles={['STYLIST', 'CLIENT']}
                page={<PersonalDetailsForm />}
              />
            }
          />
          <Route
            path="/changePassword"
            element={
              <ProtectedRoute
                roles={['STYLIST', 'CLIENT']}
                page={<ChangePassword />}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProtectedRoute roles={['STYLIST']} page={<Profile />} />}
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute
                roles={['STYLIST', 'CLIENT']}
                page={<Appointments />}
              />
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute
                roles={['STYLIST', 'CLIENT']}
                page={<Reviews />}
              />
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default AppRoutes
