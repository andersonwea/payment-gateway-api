import express from 'express'
import { listOrderById, listOrders } from '../controllers/orders-controller'

export const ordersRoutes = express()

ordersRoutes.get('/api/orders', listOrders)
ordersRoutes.get('/api/orders/:orderId', listOrderById)
