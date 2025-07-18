import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import ScreenWrapper from '../ScreenWrapper'
import ChatInput from './ChatInput'
import { useState } from 'react'

export default function ChatScreen() {
  const [text, setText] = useState('')
  return (
    <ScreenWrapper style={styles.wrapper} withScrollView={false}>
      <View style={styles.body}>
        <Text variant='bodyLarge'>Chat Body</Text>
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
