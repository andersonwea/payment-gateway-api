import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { pool } from '../lib/database'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type User = z.infer<typeof userSchema>

export async function createUser(request: Request, response: Response) {
  const _user = userSchema.safeParse(request.body)

  if (_user.success === false) {
    const message = _user.error.format()

    return response.status(400).json({ message })
  }

  const { name, email, password } = _user.data

  const hashPassword = await bcrypt.hash(password, 10)

  try {
    const query = `
      INSERT INTO users 
      (name, email, password)
      VALUES
      ($1, $2, $3)
      RETURNING id, name, email
    `

    const user = await pool.query<User>(query, [name, email, hashPassword])

    return response.status(201).json(user.rows[0])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message)

    return response.status(500).json({ message: 'Internal error.' })
  }
}
