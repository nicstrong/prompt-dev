import {
  DrawerHeaderProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer'
import { StackHeaderProps } from '@react-navigation/stack'
import { Appbar } from 'react-native-paper'

type Props = StackHeaderProps | DrawerHeaderProps

export default function AppBarHeader({
  navigation,
  route,
  options,
  ...props
}: Props) {
  const { back } = props as StackHeaderProps

  return (
    <Appbar.Header elevated>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : (navigation as any).openDrawer ? (
        <Appbar.Action
          icon='menu'
          isLeading
          onPress={() =>
            (navigation as any as DrawerNavigationProp<{}>).openDrawer()
          }
        />
      ) : null}
      <Appbar.Content title={options.title || route.name} />
    </Appbar.Header>
  )
}
