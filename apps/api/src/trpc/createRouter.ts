import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const createAppRouter = () =>
  t.router({
    userList: t.procedure.query(async () => {
      return { users: [{ id: 1, name: 'Alice' }] }
    }),
  })
