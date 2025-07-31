import { Router } from 'express'
import chatController from './chat/chat.controller.js'
import threadsController from './threads/threads.controller.js'

const api = Router().use(chatController).use(threadsController)

export const routes: Router = Router().use('/api', api)
