// SendNotification.ts
import { Client } from '@stomp/stompjs'
import { TokenManager } from './Tokens'
import { Notification } from '../Interfaces'

export default function sendNotification(
  client: Client | null,
  { to, text }: Notification
) {
  if (!client || !client.connected) {
    console.warn('STOMP client not connected')
    return false
  }

  try {
    const token = TokenManager.getAccessToken()
    const userId = TokenManager.getClaims(token as string)?.userId

    if (!userId) {
      console.error('No user ID found in token')
      return false
    }

    const payload = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      from: userId,
      to: to,
      text: text
    }

    const destination = payload.to
      ? `/user/${payload.to}/queue/inboxmessages`
      : '/topic/publicmessages'

    client.publish({
      destination,
      body: JSON.stringify(payload)
    })

    return true
  } catch (error) {
    console.error('Failed to send notification:', error)
    return false
  }
}

