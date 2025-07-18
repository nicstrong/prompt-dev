import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  CommonActions,
  createComponentForStaticNavigation,
} from '@react-navigation/native'
import { BottomNavigation, Icon } from 'react-native-paper'
import ChatScreen from './chat/ChatScreen'
import AssistantsScreen from './AssistantsScreen'
const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    animation: 'shift',
    headerShown: false,
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
    Chat: {
      screen: ChatScreen,
      options: {
        tabBarIcon: ({ color }) => (
          <Icon source='chat-outline' size={26} color={color} />
        ),
        title: 'Chat',
      },
    },
    Assistants: {
      screen: AssistantsScreen,
      options: {
        tabBarIcon: ({ color }) => (
          <Icon source='assistant' size={26} color={color} />
        ),
        title: 'Assistants',
      },
    },
  },
})

const Navigation = createComponentForStaticNavigation(HomeTabs, 'HomeNavigator')

export default Navigation
