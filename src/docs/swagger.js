const swaggerJsdoc = require('swagger-jsdoc');
const { version } = require('../../package.json');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Documentación API FlowTask',
      version,
      description: 'Documentación de la API para la aplicación FlowTask',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor Local',
      },
      {
        url: 'http://31.220.78.242:3000/api/v1',
        description: 'Servidor de Producción',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
