import * as React from 'react'

import { MD2Theme, MD3Theme } from 'react-native-paper'

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void
  toggleThemeVersion: () => void
  toggleRippleEffect: () => void
  toggleShouldUseDeviceColors?: () => void
  theme: MD2Theme | MD3Theme
  rippleEffectEnabled: boolean
  shouldUseDeviceColors?: boolean
} | null>(null)
