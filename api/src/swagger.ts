import { Application } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default (app: Application) => {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Inkmatch API",
      version: "1.0.0",
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: ['./src/routes/**.ts'],
  };

  const specs = swaggerJsDoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
