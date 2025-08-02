export const messagesKeys = {
  // No standalone "all" since messages are always under a thread
  // Base for a thread's messages
  forThread: (threadId: string) => ['threads', threadId, 'messages'] as const,

  // For all messages in a thread (optional filter like { status: 'unread' })
  lists: (threadId: string) =>
    [...messagesKeys.forThread(threadId), 'list'] as const,
  listWithFilter: (threadId: string, filter: Record<string, unknown>) =>
    [...messagesKeys.lists(threadId), { filter }] as const,

  // For a single message by ID within a thread
  byId: (threadId: string, messageId: string) =>
    [...messagesKeys.forThread(threadId), 'detail', messageId] as const,
}
