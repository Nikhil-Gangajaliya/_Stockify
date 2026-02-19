import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stockify API",
      version: "1.0.0",
      description: "API documentation for Stockify system",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
      },
    ],
  },
  apis: ["./src/routes/*.js"]
};

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
