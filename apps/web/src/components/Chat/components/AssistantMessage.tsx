import { ChatUIMessage } from '../types'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'
import { useEffect, useState } from 'react'

type Props = {
  message: ChatUIMessage
  debug?: boolean
}

export function AssistantMessage({ message, debug }: Props) {
  // Internal state to force re-renders

  const text = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')

  if (debug) {
    console.log(
      `[AssistantMessage] Rendering with text: ${JSON.stringify(text)}`,
    )
  }

  return (
    <Message from={message.role}>
      <MessageContent className='group-[.is-assistant]:text-neutral prose-invert group-[.is-assistant]:bg-transparent'>
        <div>{text}</div>
        {/* {message.parts
          .filter((part) => part.type === 'text')
          .map((part, textIndex) => {
            if (debug)
              console.log(
                `[AssistantMessage] Rendering with key: ${message.id}-text-${textIndex}: ${JSON.stringify(part.text)}`,
              )
            return (
              // <Response key={`${message.id}-text-${textIndex}`}>
              //   {part.text}
              // </Response>
              <div key={`${message.id}-text-${textIndex}`}>{part.text}</div>
            )
          })} */}
      </MessageContent>
    </Message>
  )
}
