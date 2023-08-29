import express from 'express'
import { checkout } from '../controllers/checkout-controller'

export const checkoutRoutes = express()

checkoutRoutes.post('/api/checkout', checkout)
