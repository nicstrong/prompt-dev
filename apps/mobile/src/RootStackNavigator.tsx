import { Platform } from 'react-native'

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import DrawerNavigator from './components/DrawNavigator'
import SettingsScreen from './SettingsScreen'
import AppBarHeader from './AppBarHeader'
import { useAuth } from '@clerk/clerk-expo'
import SignInScreen from './SignInScreen'

export type RootStackParamList = {
  Main: undefined
  Settings: undefined
  SignIn: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

export default function RootStackNavigator() {
  const cardStyleInterpolator =
    Platform.OS === 'android'
      ? CardStyleInterpolators.forFadeFromBottomAndroid
      : CardStyleInterpolators.forHorizontalIOS
  const { isSignedIn, isLoaded } = useAuth()
  return (
    <Stack.Navigator
      screenOptions={() => ({
        cardStyleInterpolator,
        header: (props) => <AppBarHeader {...props} />,
      })}
    >
      {isSignedIn ? (
        <>
          <Stack.Screen
            name='Main'
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Settings'
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </>
      ) : (
        <Stack.Screen name='SignIn' options={{ title: 'Sign in' }}>
          {() => <SignInScreen isLoaded={isLoaded} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  )
}
