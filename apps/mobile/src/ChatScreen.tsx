import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { Button, List, Text } from 'react-native-paper'

import ScreenWrapper from './ScreenWrapper'
import { useAppTheme } from './hooks/useAppTheme'

export default function ChatScreen() {
  const theme = useAppTheme()

  const color = theme.isV3 ? theme.colors.inversePrimary : theme.colors.accent

  return (
    <ScreenWrapper>
      <Text variant='bodyLarge'>Chat</Text>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 12,
  },
  button: {
    margin: 4,
  },
  flexReverse: {
    flexDirection: 'row-reverse',
  },
  md3FontStyles: {
    lineHeight: 32,
  },
  fontStyles: {
    fontWeight: '800',
    fontSize: 24,
  },
  flexGrow1Button: {
    flexGrow: 1,
    marginTop: 10,
  },
  width100PercentButton: {
    width: '100%',
    marginTop: 10,
  },
  customRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
  },
  noRadius: {
    borderRadius: 0,
  },
  customRadiusAndPadding: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
})
