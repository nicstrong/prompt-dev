import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { AppSocket, SocketContext } from './SocketContext.provider'
import { useAuth } from '@clerk/clerk-react'
import { scopedLog } from 'scope-log'

interface SocketProviderProps {
  children: React.ReactNode
}
const log = scopedLog('SocketProvider')

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<AppSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const { getToken } = useAuth()
  const newSocketRef = useRef<AppSocket | null>(null)

  useEffect(() => {
    let unmounted = false
    async function connect() {
      // Replace with your actual server URL
      const SERVER_URL = 'http://localhost:3000' // Or your backend URL

      const token = await getToken()
      if (unmounted) return
      const newSocket: AppSocket = io(SERVER_URL, {
        transports: ['websocket'],

        auth: { token },
        // Consider disabling autoConnect if you want to connect manually
        // based on user login status, etc.
        // autoConnect: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
      if (unmounted) return

      setSocket(newSocket)
      newSocketRef.current = newSocket

      // Event listeners for connection status
      newSocket.on('connect', () => {
        log(`Socket connected: id=${newSocketRef.current?.id}`)
        setIsConnected(true)
      })

      newSocket.on('disconnect', (reason) => {
        log(`Socket disconnected: id=${newSocketRef.current?.id}:`, reason)
        setIsConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        log.error('Socket connection error:', error)
      })
    }

    connect()

    return () => {
      unmounted = true
      log('Disconnecting socket...', newSocketRef.current?.id)
      newSocketRef.current?.disconnect()
      setIsConnected(false)
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
