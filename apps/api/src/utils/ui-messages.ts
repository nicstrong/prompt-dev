import {
  FileUIPart,
  TextUIPart,
  UIDataTypes,
  UIMessage,
  UIMessagePart,
  UITools,
} from 'ai'
import * as A from 'fp-ts/lib/Array.js'
import { pipe } from 'fp-ts/lib/function.js'

type PartType = UIMessagePart<{}, {}>['type']

const createPartPredicate =
  <
    PTYPE extends UIMessagePart<DATA_PARTS, TOOLS>,
    DATA_PARTS extends UIDataTypes = UIDataTypes,
    TOOLS extends UITools = UITools,
  >(
    type: PartType,
  ) =>
  (part: UIMessagePart<DATA_PARTS, TOOLS>): part is PTYPE => {
    return part.type === type
  }

export const isTextUIPart = createPartPredicate<TextUIPart>('text')
export const isFileUIPart = createPartPredicate<FileUIPart>('file')

export function getMessageContent<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(message: UIMessage<METADATA, DATA_PARTS, TOOLS>): string {
  return pipe(
    message.parts,
    A.filter(isTextUIPart),
    A.map((part) => part.text),
    A.reduce('', (acc, text) => acc + text),
  )
}

export function getUserMessageParts<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
>(
  message: UIMessage<METADATA, DATA_PARTS, TOOLS>,
): (TextUIPart | FileUIPart)[] {
  return pipe(
    message.parts,
    A.filter((part) => isTextUIPart(part) || isFileUIPart(part)),
  )
}
