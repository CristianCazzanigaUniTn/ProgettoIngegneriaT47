require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const partyRoutes = require('./routes/partyRoutes');
const faqRoutes = require('./routes/faqRoutes');
const app = express();

const PORT = process.env.PORT || 3000;
const DB = process.env.DB;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'A simple Express API application for user authentication',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
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
    apis: ['./routes/authRoutes.js', './routes/userRoutes.js', './routes/eventRoutes.js', './routes/partyRoutes.js', './routes/faqRoutes.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(authRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(partyRoutes);
app.use(faqRoutes);

mongoose.connect(DB)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Example app listening at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });