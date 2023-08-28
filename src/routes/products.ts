import express from 'express'
import { createProduct, listProduts } from '../controllers/products-controllers'

export const productRoutes = express()

productRoutes.post('/api/products', createProduct)
productRoutes.get('/api/products', listProduts)
