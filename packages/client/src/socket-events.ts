export interface NotificationPayload {
  id: string
  type: 'info' | 'warning' | 'error'
  message: string
  timestamp: number // Use number for Date.now() or ISO string
}

// Define other payloads if needed
export interface ItemUpdatePayloadBase {
  itemId: string
}
export interface ThreadNameUpdatePayload extends ItemUpdatePayloadBase {
  kind: 'thread-name'
  newName: string
}

export type ItemUpdatePayload = ThreadNameUpdatePayload

// Events emitted FROM the Server TO the Client
export interface ServerToClientEvents {
  // General events
  connect: () => void
  disconnect: (reason: string) => void
  connect_error: (error: Error) => void

  new_notification: (payload: NotificationPayload) => void
  item_updated: (payload: ItemUpdatePayload) => void
}

// Events emitted FROM the Client TO the Server
export interface ClientToServerEvents {}

// Inter-server events (if using multiple Socket.IO servers)
// Often not needed for client-server focus, but good practice to include
export interface InterServerEvents {}

// Data associated with each socket instance on the server-side
// Useful for storing user ID, etc., after authentication
export interface SocketData {
  userId: string | null
}
