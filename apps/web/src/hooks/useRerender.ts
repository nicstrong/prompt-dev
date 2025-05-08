import { useCallback, useEffect, useReducer } from 'react'
import { flushSync } from 'react-dom'

type Options = {
  /**
   * If 'true' rerender will be triggered after component be mounted.
   */
  runOnMount?: boolean

  /**
   * If specified rerender will be triggered after specified time in ms.
   */
  timeout?: number | number[]

  /**
   * If specified rerender will be triggered continuously with specified interval in ms.
   */
  interval?: number
}

/**
 * Provides ability to rerender component whenever necessary.
 */
export const useRerender = ({
  runOnMount = false,
  timeout,
  interval,
}: Options = {}) => {
  const [key, rerender] = useReducer((v: number) => v + 1, 0)
  const timeouts = typeof timeout === 'number' ? [timeout] : timeout
  const rerenderSync = useCallback(() => flushSync(rerender), [])

  useEffect(() => {
    if (runOnMount) rerender()
  }, [runOnMount])

  useEffect(() => {
    if (!timeouts) {
      return
    }

    const timers = timeouts.map((time) => setTimeout(rerenderSync, time))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeouts?.join(''), rerenderSync])

  useEffect(() => {
    if (typeof interval !== 'number') return

    const timer = setInterval(rerenderSync, interval)
    return () => clearInterval(timer)
  }, [interval, rerenderSync])

  return [rerender, key] as const
}
