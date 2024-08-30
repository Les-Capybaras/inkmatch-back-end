import Stripe from 'stripe'
import env from '#start/env'

const stripeSecretKey = env.get('STRIPE_SECRET_KEY')
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables')
}

const stripe = new Stripe(stripeSecretKey)

export default stripe
