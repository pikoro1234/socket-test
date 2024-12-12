import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0', // Versión de OpenAPI
  info: {
    title: 'Urbicomm.io API',
    version: '1.0.0',
    description: 'Documentación entorno Urbicomm.io',
  },
  servers: [
    {
      url: 'http://localhost:3002', // Cambia esto por la URL de tu servidor
      description: 'Servidor Local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Ruta donde están definidos tus endpoints
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
