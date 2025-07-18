import * as React from 'react'
import { StyleSheet } from 'react-native'

import { Text } from 'react-native-paper'

import { useAppTheme } from '../hooks/useAppTheme'
import ScreenWrapper from './ScreenWrapper'

export default function AssistantsScreen() {
  return (
    <ScreenWrapper style={styles.wrapper}>
      <Text variant='bodyLarge'>Assistants</Text>
    </ScreenWrapper>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    margin: 16,
  },
})
