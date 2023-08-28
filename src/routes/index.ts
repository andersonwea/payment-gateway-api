import { Router } from 'express'
import { userRoutes } from './users'
import { productRoutes } from './products'

export const router = Router()

router.use(userRoutes)
router.use(productRoutes)
