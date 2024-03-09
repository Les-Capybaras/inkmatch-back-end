/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: User authentication
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Retreive connected user data
 *     description: Retreive connected user data from database.
 *     responses:
 *       200:
 *         description: Get the current user based on the bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user. 
 *     description: Login a user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Get the token and the user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                  type: string
 *                 user:
 *                  type: object
 *             
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a user.
 *     description: Register a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fisrtname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 birthdate:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       500:
 *         description: Server error
 */

import { checkSchema } from 'express-validator';
import { createSchema, loginSchema } from '../schemas/user-schema';
import { isAuth } from '../middlewares/auth'
import { Application, Router } from 'express';
import { login, create, findOne } from '../controllers/user.controller';

export default (app: Application) => {  
    let router: Router = Router();

    // Login
    router.post("/login", checkSchema(loginSchema), login);

    // Create a new User
    router.post("/register", checkSchema(createSchema), create);

    // Retrieve a user
    router.get('/me', isAuth, findOne);
  
    app.use('/api/auth', router);
  };