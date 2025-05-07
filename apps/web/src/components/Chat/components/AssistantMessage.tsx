import { getTextFromDataUrl, UIMessage } from '@ai-sdk/ui-utils'
import DOMPurify from 'dompurify'
import { micromark } from 'micromark'

type Props = {
  message: UIMessage
}

export function AssistantMessage({ message }: Props) {
  const htmlContent = micromark(message.content)
  const sanitizedHtml = DOMPurify.sanitize(htmlContent)

  return (
    <div
      data-message-id={message.id}
      className='prose prose-neutral prose-invert flex flex-col gap-2'
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      <div className='flex flex-row gap-2'>
        {message.experimental_attachments?.map((attachment, index) =>
          attachment.contentType?.includes('image/') ? (
            <img
              key={`${message.id}-${index}`}
              className='w-24 rounded-md'
              src={attachment.url}
              alt={attachment.name}
            />
          ) : attachment.contentType?.includes('text/') ? (
            <div className='ellipsis h-24 w-32 overflow-hidden rounded-md border p-2 text-xs text-zinc-500'>
              {getTextFromDataUrl(attachment.url)}
            </div>
          ) : null,
        )}
      </div>
    </div>
  )
}
