import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swagger from '../swagger'
import userRoutes from '../routes/user.routes';
import authRoutes from '../routes/auth.routes';


export default (app: Application) => {
    app.use(cors());
    app.use(bodyParser.json());
    
    // Swagger
    swagger(app);
    
    // Routes
    userRoutes(app);
    authRoutes(app);
}