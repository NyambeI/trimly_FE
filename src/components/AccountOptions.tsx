import { useState } from 'react'

const AccountOptions = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')

  const options = [
    { href: '/personalInformation', label: 'Personal Information' },
    { href: '/changePassword', label: 'Change Password' },
    { href: '/profile', label: 'Profile' },
    { href: '/services', label: 'Services' },
    { href: '/Images', label: 'Images' }
  ]

  const handleSelect = (href: string, label: string) => {
    setSelectedOption(label)
    setIsOpen(false)
    window.location.href = href
  }

  return (
    <div className="pb-10 w-full flex justify-center">
      <div className="w-full max-w-screen-xl flex flex-col items-center">
        {/* Mobile Dropdown */}
        <div className="block sm:hidden w-full max-w-xs">
          <div className="relative w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-3 bg-black text-white text-sm font-medium rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 flex items-center justify-between"
            >
              <span>{selectedOption || 'Select Account Option'}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option.href, option.label)}
                    className="w-full px-4 py-3 text-left text-gray-900 hover:bg-yellow-100 focus:bg-yellow-100 focus:outline-none first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isOpen && (
            <div
              className="fixed inset-0 z-5"
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:block mt-4">
          <div className="grid gap-3 sm:gap-4 lg:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {options.map((option, index) => (
              <a
                key={index}
                href={option.href}
                className="px-3 py-2 sm:px-4 sm:py-3 w-full min-w-[140px] max-w-[200px] text-center bg-black text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-yellow-700 focus:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountOptions
