import { useContext } from 'react'
import { StyleSheet, Platform } from 'react-native'

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import { Drawer, Text } from 'react-native-paper'

import { PreferencesContext } from './PreferencesContext'
import { useAppTheme } from './hooks/useAppTheme'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from './RootStackNavigator'
import { DrawerActions } from '@react-navigation/native'

const DrawerItemsData = [
  {
    label: 'Settings',
    icon: 'cog-outline',
    key: 'settings',
  },
]

type Props = {
  drawerNavigation: DrawerContentComponentProps['navigation']
}

function DrawerItems({ drawerNavigation }: Props) {
  const preferences = useContext(PreferencesContext)
  const stackNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>()

  const onDrawClick = (key: string) => {
    if (key === 'settings') {
      stackNavigation.navigate('Settings')
      drawerNavigation.dispatch(DrawerActions.closeDrawer())
    }
  }

  const { colors } = useAppTheme()

  if (!preferences) throw new Error('PreferencesContext not provided')

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      style={[
        styles.drawerContent,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <>
        <Drawer.Section>
          {DrawerItemsData.map((props, index) => (
            <Drawer.Item
              {...props}
              key={props.key}
              onPress={() => onDrawClick(props.key)}
            />
          ))}
        </Drawer.Section>

        {/* <Drawer.Section title='Preferences'>
          {deviceColorsSupported && isV3 ? (
            <TouchableRipple onPress={toggleShouldUseDeviceColors}>
              <View style={[styles.preference, isV3 && styles.v3Preference]}>
                <Text variant='labelLarge'>Use device colors *</Text>
                <View pointerEvents='none'>
                  <Switch value={shouldUseDeviceColors} />
                </View>
              </View>
            </TouchableRipple>
          ) : null}
          <TouchableRipple onPress={toggleTheme}>
            <View style={[styles.preference, isV3 && styles.v3Preference]}>
              <Text variant='labelLarge'>Dark Theme</Text>
              <View pointerEvents='none'>
                <Switch value={isDarkTheme} />
              </View>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={toggleThemeVersion}>
            <View style={[styles.preference, isV3 && styles.v3Preference]}>
              <Text variant='labelLarge'>MD 2</Text>
              <View pointerEvents='none'>
                <Switch value={!isV3} />
              </View>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={toggleRippleEffect}>
            <View style={[styles.preference, isV3 && styles.v3Preference]}>
              <Text variant='labelLarge'>
                {isIOS ? 'Highlight' : 'Ripple'} effect *
              </Text>
              <View pointerEvents='none'>
                <Switch value={rippleEffectEnabled} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section> */}

        <Text variant='bodySmall' style={styles.annotation}>
          Prompt Dev Mobile 1.0.0
        </Text>
      </>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  v3Preference: {
    height: 56,
    paddingHorizontal: 28,
  },
  badge: {
    alignSelf: 'center',
  },
  collapsedSection: {
    marginTop: 16,
  },
  annotation: {
    marginHorizontal: 24,
    marginVertical: 6,
  },
})

export default DrawerItems
