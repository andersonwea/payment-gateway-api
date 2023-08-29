import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '../env'
import { pool } from '../lib/database'

export async function checkUserCredentials(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.cookies.token

  if (!token) {
    return response.status(401).json({ message: 'Unauthorized' })
  }

  try {
    let decoded: any

    try {
      decoded = jwt.verify(token, env.JWT_SECRET)
    } catch (err) {
      return response.status(401).json({ message: 'Unauthorized.' })
    }

    const { id } = decoded

    if (id === 'invalid token') {
      return response.status(401).json({ message: 'Unauthorized.' })
    }

    const query = `
      SELECT id, name, email, role 
      FROM users
      WHERE id = $1
    `

    const user = await pool.query(query, [id])

    request.user = user.rows[0]

    return next()
  } catch (err: any) {
    console.error(err.message)

    return response.status(500).json({ message: 'Internal Server Error.' })
  }
}
