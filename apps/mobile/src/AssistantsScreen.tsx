import * as React from 'react'
import { StyleSheet } from 'react-native'

import { Text } from 'react-native-paper'

import ScreenWrapper from './ScreenWrapper'
import { useAppTheme } from './hooks/useAppTheme'

export default function AssistantsScreen() {
  const theme = useAppTheme()

  const color = theme.isV3 ? theme.colors.inversePrimary : theme.colors.accent

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
