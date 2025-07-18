import { MD2Theme, MD3Theme, useTheme } from 'react-native-paper'
import { AppTheme } from '../utils/themes'

export const useAppTheme = () => useTheme<AppTheme>()
