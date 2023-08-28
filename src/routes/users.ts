import express from 'express'
import { createUser } from '../controllers/users-controller'
import { auth } from '../controllers/auth-controller'

export const userRoutes = express()

userRoutes.post('/api/users', createUser)
userRoutes.post('/api/users/auth', auth)
