import express from 'express'
import { checkout } from '../controllers/checkout-controller'
import { checkUserCredentials } from '../middlewares/check-user-credentials'

export const checkoutRoutes = express()

checkoutRoutes.post('/api/checkout', checkUserCredentials, checkout)
