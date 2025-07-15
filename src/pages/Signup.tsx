import { useState, FormEvent } from 'react'
import NavBar from '../components/NavBar'
import { UsersAPI } from '../APIs/UsersAPI'

interface Props {
  role: string
}

export default function Signup({ role }: Props) {
  // Personal details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMsg] = useState('')

  async function createAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const response = await UsersAPI.Signup(
      firstName,
      lastName,
      email,
      password,
      role
    )
    setErrorMsg(response)
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-evenly">
      <NavBar title="Register" />
      <div className="mt-20 flex items-center p-5 justify-center ">
        <form className="w-full max-w-md space-y-8" onSubmit={createAccount}>
          <div className="border-b border-gray-300 pb-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-sm text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-300 pb-6 mt-8">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-sm text-gray-600">
              We'll always let you know about important changes, via emails.
            </p>
          </div>

          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}
