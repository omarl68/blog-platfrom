import swaggerJSDoc from 'swagger-jsdoc';
import { join } from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API Documentation',
      version: '1.0.0',
      description: 'API documentation for Blog application',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: [
    './src/modules/**/*.ts',
    './src/routes/**/*.ts',
    './src/docs/api/**/*.yaml',
    './src/docs/components.yaml',
    './src/docs/tags.yaml'
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
