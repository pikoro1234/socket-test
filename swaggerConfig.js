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
      url: 'https://urbicomm.io/api/', // Cambia esto por la URL de tu servidor
      description: 'Servidor de Producción',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Ruta donde están definidos tus endpoints
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
