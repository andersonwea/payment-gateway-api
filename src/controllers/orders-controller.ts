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

export async function listOrderById(request: Request, response: Response) {
  const { id } = request.user
  const { orderId } = request.params

  try {
    const query = `
      SELECT o.*,
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'description', p.description,
          'price', p.price,
          'quantity', oi.quantity
        )	
      ) AS products
    FROM orders_items oi
    LEFT JOIN orders o
    ON o.id = oi.order_id
    INNER JOIN products p
    ON p.id = oi.product_id
    WHERE o.id = $1
    AND o.user_id = $2
    GROUP BY o.id;
    `

    const order = await pool.query(query, [orderId, id])

    return response.json(order.rows[0])
  } catch (err: any) {
    console.error(err.message)

    return response.status(500).json({ message: 'Internal Server Error.' })
  }
}
