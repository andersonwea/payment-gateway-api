import { Request, Response } from 'express'
import { z } from 'zod'
import { pool } from '../lib/database'

const productSchema = z.object({
  description: z.string(),
  price: z.number(),
})

type Product = z.infer<typeof productSchema> & {
  id: string
}

export async function createProduct(request: Request, response: Response) {
  const _product = productSchema.safeParse(request.body)

  if (_product.success === false) {
    const message = _product.error.format()

    return response.status(400).json({ message })
  }

  const { description, price } = _product.data

  try {
    const query = `
      INSERT INTO products
      (description, price)
      VALUES
      ($1, $2)
      RETURNING *
    `

    const product = await pool.query<Product>(query, [description, price])

    return response.status(201).json(product.rows[0])
  } catch (err: any) {
    return response.status(500).json({ message: 'Internal Error.' })
  }
}
