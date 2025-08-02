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
import * as R from 'fp-ts/Record'
import * as A from 'fp-ts/Array'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import { contramap, Ord } from 'fp-ts/lib/Ord'

export type ThreadGroupType =
  | 'Today'
  | 'Yesterday'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Older'

const ThreadGroupSourceOrder: Record<ThreadGroupType, number> = {
  Today: 0,
  Yesterday: 1,
  'Last 7 Days': 2,
  'Last 30 Days': 3,
  Older: 4,
}
export type ThreadGroup<TThread extends Thread> = {
  title: ThreadGroupType
  data: Array<TThread>
}

const createDateBoundaries = (today: Date) => ({
  startOfToday: startOfDay(today),
  startOfLast7Days: startOfDay(subDays(today, 6)),
  startOfLast30Days: startOfDay(subDays(today, 29)),
})

// Convert nullable timestamp to Option<Date>
const timestampToDate = (timestamp: number | null): O.Option<Date> =>
  pipe(
    timestamp,
    O.fromNullable,
    O.map((ts) => new Date(ts)),
  )

// Create thread grouping function with boundaries
const createGroupThread =
  <TThread extends Thread>(
    boundaries: ReturnType<typeof createDateBoundaries>,
  ) =>
  (item: TThread): ThreadGroupType =>
    pipe(
      item.updatedAt,
      timestampToDate,
      O.fold(
        () => 'Older' as const,
        (itemDate) => {
          if (isToday(itemDate)) return 'Today' as const
          if (isYesterday(itemDate)) return 'Yesterday' as const
          if (
            isWithinInterval(itemDate, {
              start: boundaries.startOfLast7Days,
              end: boundaries.startOfToday,
            })
          )
            return 'Last 7 Days' as const
          if (
            isWithinInterval(itemDate, {
              start: boundaries.startOfLast30Days,
              end: boundaries.startOfToday,
            })
          )
            return 'Last 30 Days' as const
          return 'Older' as const
        },
      ),
    )

const createThreadGroupOrd = <TThread extends Thread>(): Ord<
  ThreadGroup<TThread>
> =>
  contramap(
    (group: ThreadGroup<TThread>) => ThreadGroupSourceOrder[group.title],
  )(N.Ord)

export function getThreadsGrouped<TThread extends Thread>(
  threads: TThread[],
): ThreadGroup<TThread>[] {
  const boundaries = createDateBoundaries(new Date())
  const groupThread = createGroupThread<TThread>(boundaries)
  const threadGroupOrd = createThreadGroupOrd<TThread>()

  return pipe(
    threads,
    O.fromPredicate(A.isNonEmpty),
    O.map((nea) =>
      pipe(
        nea,
        groupBy(groupThread),
        R.toEntries,
        A.map(([key, data]) => ({
          title: key as ThreadGroupType,
          data,
        })),
      ),
    ),
    O.map(A.sort(threadGroupOrd)),
    O.getOrElse(() => [] as ThreadGroup<TThread>[]),
  )
}
