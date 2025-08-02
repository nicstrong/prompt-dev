import { SectionList, SectionListData, StyleSheet, View } from 'react-native'
import ScreenWrapper from '../ScreenWrapper'
import { useQuery } from '@tanstack/react-query'
import { threads } from '@prompt-dev/client'
import { Avatar, List, Text } from 'react-native-paper'
import { useCallback, useEffect, useMemo } from 'react'
import { getThreadsGrouped, ThreadGroup } from '@prompt-dev/client'
import { ThreadWithLastMessage } from '@prompt-dev/shared-types'
import EmptyCenteredView from '../ui/EmptyCenteredView'
import { Style } from 'react-native-paper/lib/typescript/components/List/utils'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ChatStackParamList } from './ChatNavigator'

export default function ThreadsScreen() {
  const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>()
  const { data, error, refetch, isLoading, isRefetching } = useQuery(
    threads.getAll.queryOptions({ includeLastMessage: true }),
  )
  const threadGroups = useMemo(() => getThreadsGrouped(data || []), [data])
  useEffect(() => {
    if (error) {
      console.error('Error fetching threads:', error)
    }
  }, [error])

  useEffect(() => {
    console.log('Threads data:', threadGroups)
  }, [threadGroups])

  const renderSectionHeader = useCallback(
    (info: {
      section: SectionListData<ThreadWithLastMessage, { title: string }>
    }) => {
      return (
        <View style={styles.sectionContainer}>
          <Text
            variant='bodyMedium'
            numberOfLines={1}
            style={[styles.subHeadingContainer]}
          >
            {info.section.title}
          </Text>
        </View>
      )
    },
    [],
  )

  const renderItem = useCallback(
    ({ item }: { item: ThreadWithLastMessage }) => {
      const Component = List.Item as any

      return (
        <Component
          title={item.name}
          description={item.lastMessage?.content ?? ''}
          left={(props: { color: string; style: Style }) => (
            <Avatar.Text style={props.style} label='AI' size={40} />
          )}
          unstable_pressDelay={65}
          onPress={() => {
            navigation.navigate('Thread', { threadId: item.id })
          }}
        />
      )
    },
    [navigation],
  )

  return (
    <ScreenWrapper style={styles.wrapper} withScrollView={false}>
      <SectionList
        sections={threadGroups}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={
          <EmptyCenteredView text={isLoading ? '' : 'No threads yet'} />
        }
        refreshing={isRefetching || isLoading}
        onRefresh={() => refetch({ cancelRefetch: true })}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  sectionContainer: {
    marginVertical: 8,
  },
  subHeadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
})
