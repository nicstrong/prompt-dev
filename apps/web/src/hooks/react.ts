import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRerender } from './useRerender'
import { createId } from '@paralleldrive/cuid2'

export const useLastValueRef = <T>(value: T) => {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}

export const setStorageItem = <T>(key: string, value: T) =>
  window.localStorage.setItem(`prompt-dev:${key}`, JSON.stringify(value))

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(`prompt-dev:${key}`) || ';',
    )
    return value === undefined ? defaultValue : value
  } catch {}
  return defaultValue
}

export const useLocalStorageState = (() => {
  let watchItems: { id: string; key: string; callback: () => void }[] = []

  return <T>(key: string, defaultValue: T) => {
    const [rerender, rerenderKey] = useRerender()
    const value: T = useMemo(
      () => getStorageItem(key, defaultValue),
      // `rerenderKey` is necessary in order to retrieve correct updated value
      // from localStorage after change
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [key, defaultValue, rerenderKey],
    )
    const constsRef = useLastValueRef({ key, value })
    const change = useCallback(
      (updater: T | ((prev: T) => T)) => {
        const { key, value } = constsRef.current
        const newValue =
          typeof updater === 'function'
            ? (updater as (prev: T) => T)(value)
            : updater
        setStorageItem(key, newValue)
        watchItems.forEach((wi) => {
          if (wi.key === key) wi.callback()
        })
      },
      [constsRef],
    )

    useEffect(() => {
      const id = createId()
      watchItems.push({ id, key, callback: rerender })

      return () => {
        watchItems = watchItems.filter((wi) => wi.id !== id)
      }
    }, [key, rerender])

    return [value, change] as const
  }
})()
