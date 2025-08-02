import { Platform } from 'react-native'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'
import ChatScreen from './ChatScreen'
import ThreadsScreen from './ThreadsScreen'
import AppBarHeader from '../../AppBarHeader'

export type ChatStackParamList = {
  Threads: undefined
  Thread: { threadId: string }
}

const Stack = createStackNavigator<ChatStackParamList>()

export default function ChatNavigator() {
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
        name='Threads'
        component={ThreadsScreen}
        options={{ title: 'Chats' }}
      />
      <Stack.Screen
        name='Thread'
        component={ChatScreen}
        options={({ route }) => ({
          title: 'Chat',
        })}
      />
    </Stack.Navigator>
  )
}
