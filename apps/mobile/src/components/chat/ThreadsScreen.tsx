import { StyleSheet, View } from 'react-native'
import ScreenWrapper from '../ScreenWrapper'

export default function ThreadsScreen() {
  return (
    <ScreenWrapper style={styles.wrapper} withScrollView={false}>
      <View />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    margin: 8,
    flex: 1,
    flexDirection: 'column',
  },
})
