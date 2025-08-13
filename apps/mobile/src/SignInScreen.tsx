import * as AuthSession from 'expo-auth-session'
import ScreenWrapper from './components/ScreenWrapper'
import { Button, Text } from 'react-native-paper'
import { useCallback, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { StartSSOFlowParams, useSSO } from '@clerk/clerk-expo'
import { ActivityIndicator, StyleSheet } from 'react-native'
import GoogleIcon from './components/icons/GoogleIcon'
import { useAppTheme } from './hooks/useAppTheme'
import { AppTheme } from './utils/themes'

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen({ isLoaded }: { isLoaded: boolean }) {
  useWarmUpBrowser()
  const theme = useAppTheme()
  const styles = createStyles(theme)

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(
    async (strategy: 'oauth_google' | 'oauth_apple') => {
      try {
        // Start the authentication process by calling `startSSOFlow()`
        const { createdSessionId, setActive, signIn, signUp } =
          await startSSOFlow({
            strategy,
            // For web, defaults to current path
            // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
            // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
            redirectUrl: AuthSession.makeRedirectUri(),
          })

        // If sign in was successful, set the active session
        if (createdSessionId) {
          setActive!({ session: createdSessionId })
        } else {
          // If there is no `createdSessionId`,
          // there are missing requirements, such as MFA
          // Use the `signIn` or `signUp` returned from `startSSOFlow`
          // to handle next steps
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      }
    },
    [],
  )

  return (
    <ScreenWrapper
      style={[styles.wrapper, !isLoaded && styles.loadingWrapper]}
      withScrollView={false}
    >
      {isLoaded && (
        <>
          <Text variant='headlineSmall'>Sign-in to prompt-dev</Text>
          <Text variant='bodySmall' style={styles.welcome}>
            Welcome back! Please sign in to continue
          </Text>
          <Button
            icon={() => <GoogleIcon width={20} height={20} />}
            onPress={() => onPress('oauth_google')}
            mode='contained-tonal'
            style={styles.button}
            textColor={theme.colors.onBackground}
            dark={theme.dark}
          >
            Sign in with Google
          </Button>
          <Button
            icon='apple'
            onPress={() => onPress('oauth_apple')}
            mode='contained-tonal'
            style={styles.button}
            textColor={theme.colors.onBackground}
            dark={theme.dark}
          >
            Sign in with Apple
          </Button>
        </>
      )}
      {!isLoaded && <ActivityIndicator animating={true} size='large' />}
    </ScreenWrapper>
  )
}

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      flexDirection: 'column',
      padding: 16,
      paddingTop: 32,
      alignItems: 'center',
    },
    loadingWrapper: {
      justifyContent: 'center',
      paddingTop: 0,
    },
    welcome: {
      marginBottom: 32,
      color: theme.colors.secondary,
    },
    button: {
      marginBottom: 16,
      marginLeft: 16,
      marginRight: 16,
      alignSelf: 'stretch',
    },
  })
