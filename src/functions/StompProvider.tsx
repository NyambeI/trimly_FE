// StompClient.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Client, IMessage } from '@stomp/stompjs'
import { toast } from 'react-toastify'
import { TokenManager } from './Tokens'

export const StompContext = createContext<Client | null>(null)
export const useStomp = () => useContext(StompContext)

const handleMsg = (msg: IMessage) => {
  console.log(msg)
  try {
    const body = JSON.parse(msg.body)
    toast(
      <div>
        <label>{body.text}</label>
        <a href='/' className="text-blue-600 text-sm">Click to view</a>
      </div>
    )
  } catch {
    toast.error('Invalid message')
  }
}

export const useStompClient = () => {
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const token = TokenManager.getAccessToken()
    const userID = TokenManager.getClaims(token as string)?.userId

    if (!token || !userID) return

    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    })

    stompClient.onConnect = () => {
      stompClient.subscribe('/topic/publicmessages', handleMsg)
      stompClient.subscribe(`/user/${userID}/queue/inboxmessages`, handleMsg)
    }

    stompClient.activate()
    setClient(stompClient)

    return () => {
      stompClient.deactivate()
    }
  }, [])

  return client
}

export const StompProvider = ({ children }: { children: React.ReactNode }) => {
  const client = useStompClient()
  return (
    <StompContext.Provider value={client}>{children}</StompContext.Provider>
  )
}
