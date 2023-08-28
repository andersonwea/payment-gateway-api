import express from 'express'
import { createProduct } from '../controllers/products-controllers'

export const productRoutes = express()

productRoutes.post('/api/products', createProduct)
