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
router.get('/files/:id', '#controllers/file_controller.show')
router.post('/files', '#controllers/file_controller.store')
router.delete('/files/:id', '#controllers/file_controller.delete').use(middleware.auth())

// Search routes
router.get('/artists', '#controllers/artists_controller.searchArtists')
router.get('/artists/:id', '#controllers/artists_controller.getArtistDetail')
router.get('/artists/:id/availability', '#controllers/artists_controller.getAvailability')
router.get('/artists/:id/appointements', '#controllers/artists_controller.getAppointements')

// Showcase routes
router
  .get('/showcases/:id', '#controllers/showcase_controller.show')
  .use(middleware.auth({ guards: ['user', 'artist'] }))
router
  .put('/showcases', '#controllers/showcase_controller.manageShowcase')
  .use([middleware.auth({ guards: ['artist'] })])

// Appointement routes
router
  .post('/appointements', '#controllers/appointement_controller.store')
  .use(middleware.auth({ guards: ['user'] }))
router
  .put('/appointements/:id/accept', '#controllers/appointement_controller.accept')
  .use(middleware.auth({ guards: ['artist'] }))
router
  .put('/appointements/:id/reject', '#controllers/appointement_controller.reject')
  .use(middleware.auth({ guards: ['artist'] }))
router
  .post(
    '/appointements/artist-to-client',
    '#controllers/appointement_controller.storeArtistToClient'
  )
  .use(middleware.auth({ guards: ['artist'] }))

// Quotation routes
router
  .get('/quotation/:id', '#controllers/quotation_controller.generate')
  .use(middleware.auth({ guards: ['artist'] }))
router.get('/:id/quotation/:appointement', '#controllers/quotation_controller.displayTemplate')
router.on('quote').render('quotation/quotation', {
  client: {
    name: 'John Doe',
    email: 'mock',
  },
  artist: {
    companyName: 'Juste et Bois',
    quoteNumber: '2024-0001',
  },
  pricing: {
    ht: 100,
    tva: 20,
    ttc: 120,
  },
  appointement: {
    date: new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    amount: 100,
  },
  validityDate: new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
})
