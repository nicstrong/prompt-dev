import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const data = {
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.string().url(),
    // OPEN_AI_API_KEY: z.string().min(1),
    PORT: z.number().int().positive().optional(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    CLERK_PUBLISHABLE_KEY: z.string().nonempty(),
    CLERK_SECRET_KEY: z.string().nonempty(),
  },

  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    // OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    PORT: process.env.PORT && parseInt(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
}
export const env = createEnv(data)
