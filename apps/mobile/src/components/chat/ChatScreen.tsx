import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import ScreenWrapper from '../ScreenWrapper'
import ChatInput from './ChatInput'
import { useState } from 'react'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { ChatStackParamList } from './ChatNavigator'

type Props = StackScreenProps<ChatStackParamList, 'Thread'>

export default function ChatScreen(props: Props) {
  const [text, setText] = useState('')

  return (
    <ScreenWrapper style={styles.wrapper} withScrollView={false}>
      <View style={styles.body}>
        <Text variant='bodyLarge'>Chat Body {props.route.params.threadId}</Text>
      </View>
      <ChatInput style={styles.input} onChangeText={setText} text={text} />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    margin: 8,
    flex: 1,
    flexDirection: 'column',
  },
  body: {
    flex: 1,
  },
  input: {},
})
