import {
  PaperProvider,
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper'
import { useMaterial3Theme } from '@pchmn/expo-material3-theme'
import { useEffect, useMemo, useState } from 'react'
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  deviceColorsSupported,
} from './utils/themes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { InitialState, NavigationContainer } from '@react-navigation/native'
import { PreferencesContext } from './PreferencesContext'
import { StatusBar } from 'expo-status-bar'
import RootStackNavigator from './RootStackNavigator'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
const PERSISTENCE_KEY = 'NAVIGATION_STATE'
const PREFERENCES_KEY = 'APP_PREFERENCES'

export function App() {
  const [themeVersion, setThemeVersion] = useState<2 | 3>(3)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [shouldUseDeviceColors, setShouldUseDeviceColors] = useState(true)
  const { theme: mdTheme } = useMaterial3Theme()
  const [rippleEffectEnabled, setRippleEffectEnabled] = useState(true)
  const [initialState, setInitialState] = useState<InitialState | undefined>()
  const [isReady, setIsReady] = useState(false)

  const theme = useMemo(() => {
    if (themeVersion === 2) {
      return isDarkMode ? MD2DarkTheme : MD2LightTheme
    }

    if (!deviceColorsSupported || !shouldUseDeviceColors) {
      return isDarkMode ? MD3DarkTheme : MD3LightTheme
    }

    return isDarkMode
      ? { ...MD3DarkTheme, colors: mdTheme.dark }
      : { ...MD3LightTheme, colors: mdTheme.light }
  }, [isDarkMode, mdTheme, shouldUseDeviceColors, themeVersion])

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
        const state = JSON.parse(savedStateString || '')

        setInitialState(state)
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY)
        const preferences = JSON.parse(prefString || '')

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark')
        }
      } catch (e) {
        // ignore error
      }
    }

    restorePrefs()
  }, [])

  const preferences = useMemo(
    () => ({
      toggleShouldUseDeviceColors: () =>
        setShouldUseDeviceColors((oldValue) => !oldValue),
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleRippleEffect: () => setRippleEffectEnabled(!rippleEffectEnabled),
      toggleThemeVersion: () => {
        setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2))
        setRippleEffectEnabled(true)
      },
      rippleEffectEnabled,
      theme,
      shouldUseDeviceColors,
    }),
    [theme, shouldUseDeviceColors, rippleEffectEnabled],
  )

  if (!isReady) {
    return null
  }

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
      theme={theme}
    >
      <PreferencesContext.Provider value={preferences}>
        <ClerkProvider tokenCache={tokenCache}>
          <NavigationContainer
            theme={combinedTheme}
            initialState={initialState}
            onStateChange={(state) =>
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }
          >
            <RootStackNavigator />
            <StatusBar style={!theme.isV3 || theme.dark ? 'light' : 'dark'} />
          </NavigationContainer>
        </ClerkProvider>
      </PreferencesContext.Provider>
    </PaperProvider>
  )
}
