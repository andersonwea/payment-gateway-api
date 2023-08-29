import { Router } from 'express'
import { userRoutes } from './users'
import { productRoutes } from './products'
import { checkoutRoutes } from './checkout'

export const router = Router()

router.use(userRoutes)
router.use(productRoutes)
router.use(checkoutRoutes)
