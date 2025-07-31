import { StyleSheet, View } from 'react-native'
import ScreenWrapper from '../ScreenWrapper'
import { useQuery } from '@tanstack/react-query'
import { threads } from '@prompt-dev/client'
import { Avatar, List, Text } from 'react-native-paper'
import { useEffect, useMemo } from 'react'
import { getThreadsGrouped } from '@prompt-dev/client'

export default function ThreadsScreen() {
  const { data, error } = useQuery(
    threads.getAll.queryOptions({ includeLastMessage: true }),
  )
  const threadGroups = useMemo(() => getThreadsGrouped(data || []), [data])
  useEffect(() => {
    if (error) {
      console.error('Error fetching threads:', error)
    }
  }, [error])

  useEffect(() => {
    console.log('Threads data:', data)
  }, [data])

  return (
    <ScreenWrapper style={styles.wrapper} withScrollView={false}>
      {Object.keys(threadGroups).map((threadGroup) => (
        <List.Section key={threadGroup}>
          <List.Subheader>{threadGroup}</List.Subheader>
          {threadGroups[threadGroup].map((thread) => (
            <List.Item
              key={thread.id}
              title={thread.name}
              description={thread.lastMessage?.content ?? ''}
              left={(props) => (
                <Avatar.Text style={props.style} label='AI' size={40} />
              )}
            />
          ))}
        </List.Section>
      ))}
      {/* Add more UI components as needed */}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
})
