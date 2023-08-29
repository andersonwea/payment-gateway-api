import { Request, Response } from 'express'
import { pool } from '../lib/database'

export async function listOrders(request: Request, response: Response) {
  const { id } = request.user

  try {
    const query = `
      SELECT * FROm orders
      WHERE user_id = $1
    `

    const orders = await pool.query(query, [id])

    return response.json(orders.rows)
  } catch (err) {
    return response.status(500).json({ message: 'Internal Server Error.' })
  }
}
