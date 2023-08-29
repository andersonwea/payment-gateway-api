import { Request, Response } from 'express'
import { z } from 'zod'
import { stripe } from '../lib/stripe'
import { pool } from '../lib/database'

export async function checkout(request: Request, response: Response) {
  const checkoutSchema = z.object({
    products: z.array(
      z.object({
        productId: z.number(),
        quantity: z.number(),
      }),
    ),
    card: z.object({
      number: z.string(),
      expMonth: z.string(),
      expYear: z.string(),
      cvc: z.string(),
    }),
  })

  const result = checkoutSchema.safeParse(request.body)

  if (result.success === false) {
    const message = result.error.format()

    return response.status(400).json({ message })
  }

  const userId = request.user.id
  const { products } = result.data

  try {
    const query = `
      SELECT price * $2 AS amount
      FROM products
      WHERE id = $1
    `

    const prices = await Promise.all(
      products.map((product) =>
        pool.query(query, [product.productId, product.quantity]),
      ),
    )

    const amount = prices.reduce(
      (acc, price) => (acc += price.rows[0].amount),
      0,
    )

    const charger = await stripe.charges.create({
      amount,
      currency: 'brl',
      source: 'tok_visa',
    })

    const orderQuery = `
      INSERT INTO orders
      (charger_id, user_id, value)
      VALUES
      ($1, $2, $3)
      RETURNING id
    `

    const order = await pool.query(orderQuery, [charger.id, userId, amount])

    const productsQuery = `
      INSERT INTO orders_items
      (product_id, user_id, order_id, quantity)
      VALUES
      ($1, $2, $3, $4)
    `

    await Promise.all(
      products.map((product) =>
        pool.query(productsQuery, [
          product.productId,
          userId,
          order.rows[0].id,
          product.quantity,
        ]),
      ),
    )

    return response.json({
      orderId: order.rows[0].id,
      payment: {
        id: charger.id,
        method: charger.payment_method_details?.card?.brand,
        value: amount,
      },
    })
  } catch (err: any) {
    console.error(err.message)

    return response.status(500).json({ message: 'Internal Server Error.' })
  }
}
