import express from 'express'
import { createUser } from '../controllers/users-controller'

export const userRoutes = express()

userRoutes.post('/api/users', createUser)
