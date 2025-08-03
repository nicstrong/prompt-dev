import * as React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import ScreenWrapper from '../ScreenWrapper'
import ChatInput from './ChatInput'
import { useState, useMemo, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { ChatStackParamList } from './ChatNavigator'
import { useQuery } from '@tanstack/react-query'
import { messages as messagesQueries } from '@prompt-dev/client'
import { AppTheme } from '../../utils/themes'
import { useAppTheme } from '../../hooks/useAppTheme'
import Markdown from 'react-native-marked'

import { Message } from '@prompt-dev/shared-types'
import { MarkdownThemed } from '../ui/MarkdownThemed'

type Props = StackScreenProps<ChatStackParamList, 'Thread'>

export default function ChatScreen(props: Props) {
  const theme = useAppTheme()
  const styles = useMemo(() => createStyles(theme), [theme])
  const { data, error, refetch, isLoading, isRefetching } = useQuery(
    messagesQueries.getByThreadId.queryOptions(props.route.params.threadId),
  )

  useEffect(() => {
    console.log('theme', theme)
  }, [theme])

  const messages = useMemo(
    () =>
      data?.messages.filter(
        (msg) => msg.role === 'user' || msg.role === 'assistant',
      ),
    [data],
  )
  const [text, setText] = useState('')

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user'
    return isUser ? (
      <UserMessage content={item.content} styles={styles} />
    ) : (
      <MarkdownThemed content={item.content} />
    )
  }

  return (
    <ScreenWrapper style={styles.wrapper} withScrollView={false}>
      <FlatList
        data={messages}
        refreshing={isRefetching || isLoading}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <ChatInput style={styles.input} onChangeText={setText} text={text} />
    </ScreenWrapper>
  )
}

function UserMessage({
  content,
  styles,
}: {
  content: string
  styles: ReturnType<typeof createStyles>
}) {
  return (
    <View style={styles.userMessage}>
      <Text variant='bodyLarge'>{content}</Text>
    </View>
  )
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      display: 'flex',
      margin: 12,
      flex: 1,
      flexDirection: 'column',
    },
    userMessage: {
      backgroundColor: theme.colors.primaryContainer,
      marginLeft: 32,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      padding: 8,
    },
    separator: {
      height: 16,
      backgroundColor: 'transparent',
    },
    input: {},
  })
