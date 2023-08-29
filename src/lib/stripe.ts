import Stripe from 'stripe'
import { env } from '../env/index'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
  appInfo: {
    name: 'Gateway-api',
  },
})
