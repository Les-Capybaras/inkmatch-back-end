/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
router
  .get('/whoami', '#controllers/auth_controller.whoami')
  .use(middleware.auth({ guards: ['user', 'artist'] }))

// File routes
router.get('/files/:id', '#controllers/file_controller.show').use(middleware.auth())
router.post('/files', '#controllers/file_controller.store').use(middleware.auth())
router.delete('/files/:id', '#controllers/file_controller.delete').use(middleware.auth())

// Search routes
router.get('/artists', '#controllers/artists_controller.searchArtists').use(middleware.auth())
router.get('/artists/:id', '#controllers/artists_controller.getArtistDetail').use(middleware.auth())

// Showcase routes
router
  .get('/showcases/:id', '#controllers/showcase_controller.show')
  .use(middleware.auth({ guards: ['user', 'artist'] }))
router
  .put('/showcases', '#controllers/showcase_controller.manageShowcase')
  .use([middleware.auth({ guards: ['artist'] })])

// Appointement routes
router.post('/appointements', '#controllers/appointement_controller.store').use(middleware.auth())
