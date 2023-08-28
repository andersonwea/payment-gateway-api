import { z } from 'zod'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
    override: true,
  })
} else {
  config()
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  PGHOST: z.string(),
  PGPORT: z.coerce.number(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),
  PGDATABASE: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
