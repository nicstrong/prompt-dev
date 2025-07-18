import * as React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppTheme } from '../hooks/useAppTheme'
import { useHeaderHeight } from '@react-navigation/elements'

type Props = ScrollViewProps & {
  children: React.ReactNode
  withScrollView?: boolean
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

export default function ScreenWrapper({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  ...rest
}: Props) {
  const theme = useAppTheme()

  const insets = useSafeAreaInsets()

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors.background,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.left,
    },
  ]
  const headerHeight = useHeaderHeight()

  return (
    <KeyboardAvoidingView
      style={styles.keyboaardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      {withScrollView ? (
        <ScrollView
          {...rest}
          contentContainerStyle={contentContainerStyle}
          keyboardShouldPersistTaps='always'
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={[containerStyle, style]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[containerStyle, style]}>{children}</View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboaardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
})
