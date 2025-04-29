import { createContext, useContext } from 'react'
import { Socket } from 'socket.io-client'
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@prompt-dev/shared-types'

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

type SocketContextType = {
  socket: AppSocket | null
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}
