import { atom, createStore } from 'jotai'
import { ChatProviderOptions } from './ChatProvider.types'

export const chatStore = createStore()

export const configAtom = atom<ChatProviderOptions | null>(null)

export const getConfig = () => {
  const value = chatStore.get(configAtom)
  if (value === null) {
    throw new Error('ChatProvider did not set config to configAtom')
  }
  return value
}

export const setConfig = (options: ChatProviderOptions) => {
  chatStore.set(configAtom, options)
}
