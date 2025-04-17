import { TextUIPart, ToolInvocationUIPart } from '@ai-sdk/ui-utils'
import { streamText } from 'ai'
import { NewMessage } from '~/db/messages.js'
import { PartType } from '~/db/schema.js'

type OnFinishType = Parameters<typeof streamText>[0]['onFinish']
type FuncOnly<T> = T extends (...args: any[]) => any ? T : never
type ResponseMessage = Parameters<
  FuncOnly<OnFinishType>
>[0]['response']['messages'][number]

export function convertResponseMessageToDbMessage(
  messages: ResponseMessage[],
  threadId: string,
): NewMessage {
  let content = ''
  let parts: PartType[] = []

  for (const message of messages) {
    if (message.role === 'assistant') {
      if (typeof message.content === 'string') {
        content += message.content
      } else {
        for (const part of message.content) {
          switch (part.type) {
            case 'text':
              parts.push({
                type: 'text',
                text: part.text,
              } as TextUIPart)
              break
            case 'tool-call':
              if (part.type === 'tool-call') {
                parts.push({
                  type: 'tool-invocation',
                  toolInvocation: {
                    state: 'call',
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    args: part.args,
                  },
                } as ToolInvocationUIPart)
              }
              break
          }
        }
      }
    } else {
      for (const toolResultPart of message.content) {
        if (toolResultPart.type === 'tool-result') {
          parts.push({
            type: 'tool-invocation',
            toolInvocation: {
              state: 'result',
              toolCallId: toolResultPart.toolCallId,
              toolName: toolResultPart.toolName,
              result: toolResultPart.result,
            },
          } as ToolInvocationUIPart)
        }
      }
    }
  }

  if (content === '') {
    const textPart = parts.find((part) => part.type === 'text')
    if (textPart) {
      content = textPart.text
    }
  }

  return {
    role: 'assistant',
    threadId: threadId,
    content,
    parts,
  }
}
