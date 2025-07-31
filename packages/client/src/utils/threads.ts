import { Thread } from '@prompt-dev/shared-types'
import {
  isToday,
  isWithinInterval,
  isYesterday,
  startOfDay,
  subDays,
} from 'date-fns'
import { pipe } from 'fp-ts/lib/function'
import { groupBy } from 'fp-ts/NonEmptyArray'

type ThreadGroup =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Older'

export function getThreadsGrouped<TThread extends Thread>(
  threads: TThread[],
): Record<ThreadGroup, Array<TThread>> {
  const today = new Date()
  const startOfToday = startOfDay(today)
  const startOfLast7Days = startOfDay(subDays(today, 6)) // Includes today
  const startOfLast30Days = startOfDay(subDays(today, 29)) // Includes todayå

  const groupThread = (item: TThread): ThreadGroup => {
    const itemDate = item.updatedAt

    if (itemDate === null) {
      return 'Older'
    }

    if (isToday(itemDate)) {
      return 'Today'
    }
    if (isYesterday(itemDate)) {
      return 'Yesterday'
    }
    if (
      isWithinInterval(itemDate, {
        start: startOfLast7Days,
        end: startOfToday,
      })
    ) {
      return 'Last 7 Days'
    }
    if (
      isWithinInterval(itemDate, {
        start: startOfLast30Days,
        end: startOfToday,
      })
    ) {
      return 'Last 30 Days'
    }
    return 'Older'
  }

  const data = pipe(threads, groupBy(groupThread))
  return data as Record<ThreadGroup, Array<TThread>>
}
