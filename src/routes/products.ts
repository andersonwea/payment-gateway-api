import express from 'express'
import { createProduct, listProduts } from '../controllers/products-controllers'
import { checkUserCredentials } from '../middlewares/check-user-credentials'

export const productRoutes = express()

productRoutes.get('/api/products', listProduts)
productRoutes.post('/api/products', checkUserCredentials, createProduct)
