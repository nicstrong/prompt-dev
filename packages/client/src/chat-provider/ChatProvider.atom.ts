import { atom } from 'jotai'
import { ChatProviderOptions } from './ChatProvider.types'
import { chatStore } from './ChatProvider'

const configAtom = atom<ChatProviderOptions | null>(null)

export const getConfig = () => {
  const value = chatStore.get(configAtom)
  if (value === null) {
    throw new Error('ChatProvider is not in context')
  }
  return value
}
