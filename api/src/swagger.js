module.exports = (app) => {
  const swaggerJsdoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");

  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Express API for JSONPlaceholder",
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
    apis: ['./src/routes/**.js'],
  };

  const specs = swaggerJsdoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
