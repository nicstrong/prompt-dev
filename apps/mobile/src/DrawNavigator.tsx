import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import DrawerItems from './DrawerItems'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeNavigator from './HomeNavigator'

const Drawer = createDrawerNavigator<{ Home: undefined }>()

export default function DrawerNavigator() {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => {
        const { left, right } = insets || { left: 0, right: 0 }
        const collapsedDrawerWidth = 100 + Math.max(left, right)
        return (
          <Drawer.Navigator
            drawerContent={({ navigation }) => (
              <DrawerItems drawerNavigation={navigation} />
            )}
          >
            <Drawer.Screen
              name='Home'
              component={HomeNavigator}
              options={{ headerShown: true }}
            />
          </Drawer.Navigator>
        )
      }}
    </SafeAreaInsetsContext.Consumer>
  )
}
