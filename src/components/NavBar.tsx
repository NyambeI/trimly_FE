import { Link } from 'react-router-dom'
import { Bell, User } from 'lucide-react'
import { TokenManager } from '../functions/Tokens'

const NavBar = ({ title }: { title: string }) => {
  const token = TokenManager.getAccessToken() as string
  const claims=TokenManager.getClaims(token)

  if (title === 'Home' || title === 'Register' || title === 'Login') {
    return (
      <nav className="top-0 left-0 fixed w-full bg-gray-900 shadow-md flex items-center justify-between px-4 md:px-8 py-4 z-50">
        <a href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-white">Trimly</h1>
        </a>
        <div className="space-x-3">
          <a
            href="/Login"
            className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 transition duration-300"
          >
            Login
          </a>
        </div>
      </nav>
    )
  } else {
    return (
      <div className="fixed top-0 left-0 w-full items-center justify-between z-50">
        <header className="bg-white shadow-md p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a className="flex items-center gap-2" href="/">
              <div className="font-bold text-2xl text-black">Trimly</div>
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <div className="text-gray-500 text-sm">{title}</div>
            </a>

            {token && (
              <div className="flex items-center gap-4">
                <div className="relative group w-[200px] mx-auto">
                  {/* Toggle Button */}
                  <div className="flex items-center justify-end md:justify-between px-4 py-2 pr-12 cursor-pointer">
                    <div className="flex flex-row-reverse md:flex-row items-center gap-2 w-full">
                      <User className="w-7 h-7 text-gray-700 hover:text-black transition" />
                      <p className="hidden md:block text-gray-500 w-full text-sm">
                        {claims?.sub}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="invisible group-hover:visible absolute z-50 w-full bg-white shadow-xl px-4 py-2 flex flex-col gap-2 transition-all">
                    <a
                      href="/personalInformation"
                      className="py-1 text-sm text-black hover:bg-gray-200"
                    >
                      Personal Information
                    </a>
                    <a
                      href="/changePassword"
                      className="py-1 text-sm text-black hover:bg-gray-200"
                    >
                      Change Password
                    </a>
                    <button
                      onClick={() => TokenManager.Logout()}
                      className="py-1 text-sm text-red-600 font-semibold hover:bg-gray-200 text-left"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    )
  }
}

const options = [
  { href: '/personalInformation', label: 'Personal Information' },
  { href: '/changePassword', label: 'Change Password' },
  { href: '/profile', label: 'Profile' },
  { href: '/services', label: 'Services' },
  { href: '/Images', label: 'Images' }
]

export default NavBar
