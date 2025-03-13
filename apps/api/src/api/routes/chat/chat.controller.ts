import { NextFunction, Request, Response, Router } from 'express'

const router: Router = Router()

router.post(
  '/chat',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({})
    } catch (error) {
      next(error)
    }
  },
)

export default router
