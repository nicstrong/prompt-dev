import Markdown, { MarkedStyles, MarkdownProps } from 'react-native-marked'
import { useAppTheme } from '../../hooks/useAppTheme'
import { useMemo } from 'react'
import { AppTheme } from '../../utils/themes'

type Props = {
  content: string
  styles?: MarkedStyles | undefined
}

export function MarkdownThemed({ content, styles }: Props) {
  const theme = useAppTheme()
  const markdownTheme = useMemo(() => getMarkdownTheme(theme), [theme])
  return (
    <Markdown
      styles={styles}
      value={content}
      flatListProps={{
        initialNumToRender: 8,
        style: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  )
}

function getMarkdownTheme(theme: AppTheme): MarkdownProps['theme'] {
  return {}
}
