import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CommonActions, createStaticNavigation } from '@react-navigation/native'
import { BottomNavigation, Icon, Provider } from 'react-native-paper'
import ChatScreen from './ChatScreen'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    animation: 'shift',
  },
  tabBar: ({ navigation, state, descriptors, insets }) => (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        })

        if (event.defaultPrevented) {
          preventDefault()
        } else {
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          })
        }
      }}
      renderIcon={({ route, focused, color }) =>
        descriptors[route.key].options.tabBarIcon?.({
          focused,
          color,
          size: 24,
        }) || null
      }
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key]
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
              ? options.title
              : route.name

        return label
      }}
    />
  ),
  screens: {
    Home: {
      screen: ChatScreen,
      options: {
        tabBarIcon: ({ color }) => (
          <Icon source='chat-outline' size={26} color={color} />
        ),
      },
    },
  },
})

const Navigation = createStaticNavigation(HomeTabs)

const HomeNavigator = () => {
  return (
    <View>
      <Text variant='bodyLarge'>Home Navigator</Text>
    </View>
  )
}
export default HomeNavigator
