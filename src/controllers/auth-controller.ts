import { Request, Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../lib/database'
import { env } from '../env'
import { User } from '../@types/user'

export async function auth(request: Request, response: Response) {
  const authSchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const auth = authSchema.safeParse(request.body)

  if (auth.success === false) {
    const message = auth.error.format()

    return response.status(400).json({ message })
  }

  const { email, password } = auth.data

  const query = `
    SELECT * FROM users
    WHERE email = $1
  `

  try {
    const user = await pool.query<User>(query, [email])

    if (user.rowCount === 0) {
      return response
        .status(401)
        .json({ message: 'Invalid username or password.' })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.rows[0].password,
    )

    if (!isPasswordCorrect) {
      return response
        .status(401)
        .json({ message: 'Invalid username or password.' })
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    const { password: _pass, ...userDetails } = user.rows[0]

    return response
      .cookie('token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      .json(userDetails)
  } catch (err: any) {
    return response.status(500).json({ message: 'Internal Server error.' })
  }
}
