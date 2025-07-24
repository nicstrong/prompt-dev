import { atom, createStore, Provider as JotaiProvider, Store } from 'jotai'
import { ApiOptions } from './types'

let internalStore: Store | null = null
function getOrCreateInternalStore() {
  if (!internalStore) {
    internalStore = createStore()
  }
  return internalStore
}

// The config atom (default to empty)
export const configAtom = atom<ApiOptions>()

// Function to initialize the config (called in provider)
export function initializeConfig(
  store: Store | undefined,
  options: ApiOptions,
) {
  const targetStore = store || getOrCreateInternalStore()
  targetStore.set(configAtom, options)
  return targetStore
}

// Accessor for non-React contexts (e.g., query functions)
export function getConfig(): ApiOptions {
  const store = internalStore // Or resolve from a global if injected
  if (!store) {
    throw new Error(
      'Config not initialized. Wrap your app in <PromptDevProvider>.',
    )
  }
  return store.get(configAtom)
}

export function subscribeToConfig(callback: (options: ApiOptions) => void) {
  const store = internalStore
  if (!store) {
    throw new Error('Config not initialized.')
  }
  return store.sub(configAtom, callback)
}
