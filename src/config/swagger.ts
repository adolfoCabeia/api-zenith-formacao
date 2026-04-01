import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Cursos - Centro de Formação",
      version: "1.0.0",
      description: "API para gerenciamento de cursos. Interface moderna e intuitiva.",
      contact: {
        name: "Adolfo Cabeia",
        email: "contato@seucentro.com",
      },
    },
    servers: [
      { url: "http://localhost:8000", description: "Servidor local" }
    ],
  },
  apis: ["./src/routes/*.ts"], 
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: express.Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: `
        .swagger-ui .topbar { background-color: #1f2937; padding: 15px; }
        .swagger-ui .topbar a span { color: #facc15; font-weight: bold; font-size: 1.5rem; }
        .swagger-ui .info h2, .swagger-ui .info h1 { color: #111827; }
        .swagger-ui .info p { color: #374151; font-size: 1rem; }
        .swagger-ui .scheme-container { background-color: #0000; border-radius: 10px; padding: 10px; }
        .swagger-ui .opblock { border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 15px; }
        .swagger-ui .opblock-summary-method { font-weight: bold; color: #111827; }
        .swagger-ui .responses-wrapper { background-color: #0000; border-radius: 6px; padding: 10px; }
      `,
      customSiteTitle: "Centro de Formação - API",
      customfavIcon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/book--v1.png",
      swaggerOptions: {
        docExpansion: "none",
        persistAuthorization: true, 
        defaultModelsExpandDepth: -1, 
      },
    })
  );
};