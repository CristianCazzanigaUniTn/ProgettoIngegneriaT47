const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
//qua le costanti delle rotte
const partecipazioniRouter = require('./routes/partecipazioni');
const commentiRouter = require('./routes/commenti');
const likesRouter = require('./routes/like');
const connection = require('./db'); 

const app = express();
const port = 3000;

app.use(express.json());


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API di Evently',
            version: '1.0.0',
            description: 'Documentazione delle API per il progetto Evently',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Qua le rotte
app.use('', partecipazioniRouter);

app.use('', commentiRouter);

app.use('', likesRouter);

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
