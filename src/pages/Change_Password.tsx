import React, { FormEvent, useState } from 'react'
import { TokenManager } from '../functions/Tokens'
import { UsersAPI } from '../APIs/UsersAPI'
import NavBar from '../components/NavBar'

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMsg] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const id = TokenManager.getClaims(TokenManager.getAccessToken() as string)
    ?.userId as number

  async function ChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMessage('')
    if (newPassword == confirmPassword) {
      const response = await UsersAPI.Update(
        id,
        null,
        null,
        newPassword, null,null,null
      )

      if (response) {
        setErrorMsg(response.message || 'Something went wrong.')
      } else {
        setSuccessMessage('Password updated successfully!')
      }
    } else {
      setErrorMsg("Passwords don't match!")
    }
  }

  return (
    <div>
      <NavBar title="Account" />
      <div className=" w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <form className="w-full max-w-md space-y-8" onSubmit={ChangePassword}>
          <div className="border-b border-gray-300 pb-6">
            <h2 className="text-lg  text-center font-semibold">
              Change Password
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}
