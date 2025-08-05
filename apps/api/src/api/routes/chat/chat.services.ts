import { NewMessage } from '~/db/messages.js'
import { PartType } from '~/db/schema.js'
import { ChatUIMessage } from './chat.schemas.js'

export function convertUIMessageToDbMessage(
  messages: ChatUIMessage[],
  threadId: string,
): NewMessage {
  let parts: PartType[] = []

  for (const message of messages) {
    parts.push(...(message.parts as any))
  }

  return {
    role: 'assistant',
    threadId: threadId,
    parts,
  }
}
