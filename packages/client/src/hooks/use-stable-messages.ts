import { UIMessage } from '@ai-sdk/react'
import type { ChatStatus } from 'ai'
import { useEffect, useMemo, useRef, useState } from 'react'

type StatusType = ChatStatus

export function useStableMessages<TMessage extends UIMessage>(
  status: StatusType,
  messages: TMessage[],
) {
  const [stableMessages, setStableMessages] = useState<TMessage[]>(messages)
  const [generatingMessage, setGeneratingMessage] = useState<
    TMessage | undefined
  >(undefined)

  const stableRef = useRef<TMessage[]>(stableMessages)
  stableRef.current = stableMessages

  const equalById = (a: TMessage[], b: TMessage[]) => {
    if (a === b) return true
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i]?.id !== b[i]?.id) return false
    }
    return true
  }

  useEffect(() => {
    const isGeneratingState = status === 'submitted' || status === 'streaming'
    const last = messages.length > 0 ? messages[messages.length - 1] : undefined

    if (isGeneratingState && last && last.role === 'assistant') {
      const nextStable = messages.slice(0, messages.length - 1)

      if (!equalById(stableRef.current, nextStable)) {
        setStableMessages(nextStable)
      }

      setGeneratingMessage(last)
      return
    }

    if (!equalById(stableRef.current, messages)) {
      setStableMessages(messages)
    }
    if (generatingMessage !== undefined) setGeneratingMessage(undefined)
  }, [messages, status])

  return useMemo(
    () => ({ stableMessages, generatingMessage }),
    [stableMessages, generatingMessage],
  )
}
