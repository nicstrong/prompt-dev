import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native'
import { IconButton, Text } from 'react-native-paper'
import { useAppTheme } from '../../hooks/useAppTheme'
import { AppTheme } from '../../utils/themes'

type Props = {
  style?: StyleProp<ViewStyle>
  onChangeText: (text: string) => void
  text: string
}

export default function ChatInput({ style, onChangeText, text }: Props) {
  const theme = useAppTheme()
  const styles = createStyles(theme)

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder='Ask a question...'
        value={text}
      />
      <View style={styles.controls}>
        <IconButton
          icon='send'
          iconColor={theme.colors.primary}
          size={20}
          onPress={() => console.log('Pressed')}
          disabled={!text.trim()}
        />
      </View>
    </View>
  )
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      borderColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderRadius: 8,
      marginTop: 2,
    },
    input: {
      marginLeft: 8,
      marginRight: 8,
    },
    controls: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  })
