import { Platform, StyleSheet, View } from 'react-native'

import type { DrawerNavigationProp } from '@react-navigation/drawer'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import { Appbar, Drawer } from 'react-native-paper'
import Chat from './ChatScreen'
import DrawerNavigator from './DrawNavigator'
import SettingsScreen from './SettingsScreen'
import AppBarHeader from './AppBarHeader'

export type RootStackParamList = {
  Main: undefined
  Settings: undefined
  // Add other global overlays here, e.g., Profile: { userId: string };
}

const Stack = createStackNavigator<RootStackParamList>()

export default function RootStackNavigator() {
  const cardStyleInterpolator =
    Platform.OS === 'android'
      ? CardStyleInterpolators.forFadeFromBottomAndroid
      : CardStyleInterpolators.forHorizontalIOS

  return (
    <Stack.Navigator
      screenOptions={() => ({
        cardStyleInterpolator,
        header: (props) => <AppBarHeader {...props} />,
      })}
    >
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
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  stackWrapper: {
    flex: 1,
    ...Platform.select({
      web: {
        overflow: 'scroll',
      },
    }),
  },
})
