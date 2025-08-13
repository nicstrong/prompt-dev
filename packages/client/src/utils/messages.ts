import { ChatUIMessage } from '~/chat-provider'

type PartsType = ChatUIMessage['parts']

export function getMessageContent(message: { parts: PartsType }): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
}
