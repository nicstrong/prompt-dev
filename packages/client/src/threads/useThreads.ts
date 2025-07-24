import { usePromptDevContext } from '~/PromptDevProvider.context'

export function useThreads() {
  const { execute } = usePromptDevContext()

  
  return {
    threads: [],
    loading: false,
    error: null,
  }
}
