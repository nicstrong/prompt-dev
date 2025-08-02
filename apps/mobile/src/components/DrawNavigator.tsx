import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import DrawerItems from './DrawerItems'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import HomeNavigator from './HomeNavigator'
import AppBarHeader from '../AppBarHeader'

const Drawer = createDrawerNavigator<{ Home: undefined }>()

export default function DrawerNavigator() {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => {
        const { left, right } = insets || { left: 0, right: 0 }
        const collapsedDrawerWidth = 100 + Math.max(left, right)
        return (
          <Drawer.Navigator
            screenOptions={{
              header: (props) => <AppBarHeader {...props} />,
            }}
            drawerContent={({ navigation }) => (
              <DrawerItems drawerNavigation={navigation} />
            )}
          >
            <Drawer.Screen
              name='Home'
              component={HomeNavigator}
              options={({ route }) => {
                // Get the name of the focused tab
                const routeName = getFocusedRouteNameFromRoute(route) ?? 'Chat'
                // Hide header for Chat tab since ChatNavigator manages its own header
                const headerShown = routeName !== 'Chat'
                return {
                  title: routeName,
                  headerShown,
                }
              }}
            />
          </Drawer.Navigator>
        )
      }}
    </SafeAreaInsetsContext.Consumer>
  )
}
