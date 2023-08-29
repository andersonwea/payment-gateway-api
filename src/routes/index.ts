import { Router } from 'express'
import { userRoutes } from './users'
import { productRoutes } from './products'
import { checkoutRoutes } from './checkout'
import { ordersRoutes } from './orders'
import { checkUserCredentials } from '../middlewares/check-user-credentials'

export const router = Router()

router.use(userRoutes)
router.use(productRoutes)

router.use(checkUserCredentials)
router.use(checkoutRoutes)
router.use(ordersRoutes)
