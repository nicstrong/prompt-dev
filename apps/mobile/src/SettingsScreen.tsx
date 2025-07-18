import { useAppTheme } from './hooks/useAppTheme'
import ScreenWrapper from './components/ScreenWrapper'
import { Text } from 'react-native-paper'

export default function SettingsScreen() {
  const theme = useAppTheme()

  const color = theme.isV3 ? theme.colors.inversePrimary : theme.colors.accent

  return (
    <ScreenWrapper>
      <Text variant='bodyLarge'>Settings</Text>
    </ScreenWrapper>
  )
}
