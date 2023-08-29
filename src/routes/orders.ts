import express from 'express'
import { listOrders } from '../controllers/orders-controller'

export const ordersRoutes = express()

ordersRoutes.get('/api/orders', listOrders)
