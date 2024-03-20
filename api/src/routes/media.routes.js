/**
 * @swagger
 * tags:
 *  - name: Media
 *    description: Media routes
 * paths:
 *  /medias:
 *    post:
 *      tags: [Media]
 *      summary: Create a new media
 *      description: Create a new media
 *      responses:
 *        200:
 *          description: Create a new media
 *          content:
 *            application/json:
 *  /medias/{id}:
 *    get:
 *      tags: [Media]
 *      summary: Retrieve a specific media
 *      description: Retrieve a specific media
 *      responses:
 *        200:
 *          description: Get a specific media
 *          content:
 *            application/json:
 */

const express = require('express')
const router = express.Router()
const { isAuth } = require('../middlewares/auth.js')
const { upload } = require('../middlewares/uploader.js')
const controller = require('../controllers/media.controller.js')

module.exports = (app) => {
  // Create a new media
  router.post('/', [isAuth, upload.single('file')], controller.upload)

  // Download a specific media
  router.get('/:id', isAuth, controller.download)

  app.use('/api/medias', router)
}
