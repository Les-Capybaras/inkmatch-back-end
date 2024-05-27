/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world !',
  }
})

router.post('/login', '#controllers/auth_controller.login')
router.post('/register', '#controllers/auth_controller.register')
router.post('/verify-email', '#controllers/auth_controller.verifyEmail')
router.post('/reset-password', '#controllers/auth_controller.requestResetPassword')
router.post('/reset-password/:token', '#controllers/auth_controller.resetPassword')
