import { Router } from "express";
import chatController from "./chat/chat.controller.js";

const api = Router()
  .use(chatController)


  
  export const routes: Router = Router().use('/api', api);