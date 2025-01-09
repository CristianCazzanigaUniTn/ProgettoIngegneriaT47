const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

// Configurazione di Swagger JSDoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentazione API generata automaticamente con swagger-jsdoc.',
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Localhost server',
      },
    ],
  },
  apis: ['./routes/authRoutes.js', './routes/userRoutes.js', './routes/commentiRoutes.js', './routes/likeRoutes.js', './routes/partecipazioniRoutes.js', './routes/eventRoutes.js', './routes/partyRoutes.js', './routes/faqRoutes.js', './routes/postRoutes.js', './routes/cloudFotoRoutes.js', './routes/EmailRoutes.js', './routes/categoriaRoutes.js'] 
};

// Genera la specifica OpenAPI
const openapiSpecification = swaggerJsdoc(options);

// Salva la specifica in un file
const outputPath = path.join(__dirname, 'openapi.yaml'); // Cambia in 'openapi.json' se vuoi JSON
fs.writeFileSync(outputPath, JSON.stringify(openapiSpecification, null, 2), 'utf8');

console.log(`Documentazione OpenAPI generata e salvata in: ${outputPath}`);
