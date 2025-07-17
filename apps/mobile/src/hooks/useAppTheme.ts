import { MD2Theme, MD3Theme, useTheme } from 'react-native-paper'

export const useAppTheme = () => useTheme<MD2Theme | MD3Theme>()
