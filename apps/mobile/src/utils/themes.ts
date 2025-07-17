import { Platform } from 'react-native'
import ExpoMaterial3ThemeModule from '@pchmn/expo-material3-theme/build/ExpoMaterial3ThemeModule'
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
})

export const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    ...LightTheme.fonts,
  },
}

export const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    ...DarkTheme.fonts,
  },
}

type CombinedTheme = typeof CombinedDefaultTheme

export const deviceColorsSupported =
  Boolean(ExpoMaterial3ThemeModule) &&
  Platform.OS === 'android' &&
  Platform.Version >= 31
