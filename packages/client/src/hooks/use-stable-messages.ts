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

  useEffect(() => {
    const isGeneratingState = status === 'submitted' || status === 'streaming'
    const last = messages.length > 0 ? messages[messages.length - 1] : undefined

    if (isGeneratingState && last && last.role === 'assistant') {
      const nextStableLength = messages.length - 1

      // Only update stable messages if the stable portion has grown
      // (elements 0..n-2 never change, so length comparison is sufficient)
      if (stableRef.current.length !== nextStableLength) {
        setStableMessages(messages.slice(0, nextStableLength))
      }

      setGeneratingMessage(last)
      return
    }

    // Only update if the total message count has changed
    // (since elements never mutate once added, length comparison is sufficient)
    if (stableRef.current.length !== messages.length) {
      setStableMessages(messages)
    }
    if (generatingMessage !== undefined) setGeneratingMessage(undefined)
  }, [messages, status])

  return useMemo(
    () => ({ stableMessages, generatingMessage }),
    [stableMessages, generatingMessage],
  )
}
