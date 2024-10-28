const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(err => {
    if (err) {
        console.error('Errore di connessione al database:', err);
        return;
    }
    console.log('Connesso al database MySQL/MariaDB!');
});

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
    apis: ['./index.js'], // specifica il percorso delle annotazioni Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ---------------------------------------------
//  API per Utenti
// ---------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Utenti
 *   description: Gestione degli utenti
 */

/**
 * @swagger
 * /api/utenti:
 *   get:
 *     summary: Recupera tutti gli utenti
 *     tags: [Utenti]
 *     responses:
 *       200:
 *         description: Lista di utenti
 */
app.get('/api/utenti', (req, res) => {
    connection.query('SELECT * FROM utenti', (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero degli utenti' });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/utenti/{id}:
 *   get:
 *     summary: Recupera un utente specifico
 *     tags: [Utenti]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dell'utente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utente trovato
 *       404:
 *         description: Utente non trovato
 */
app.get('/api/utenti/:id', (req, res) => {
    connection.query('SELECT * FROM utenti WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dell\'utente' });
        if (results.length === 0) return res.status(404).json({ error: 'Utente non trovato' });
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /api/utenti:
 *   post:
 *     summary: Crea un nuovo utente
 *     tags: [Utenti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cognome:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               data_registrazione:
 *                 type: string
 *                 format: date-time
 *               ruolo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente creato
 */
app.post('/api/utenti', (req, res) => {
    const { nome, cognome, email, password, data_registrazione, ruolo } = req.body;
    const formattedDataRegistrazione = data_registrazione.replace('T', ' ').slice(0, 19);
    connection.query(
        'INSERT INTO utenti (nome, cognome, email, password, data_registrazione, ruolo, preferenze_notifica) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [nome, cognome, email, password, formattedDataRegistrazione, ruolo, '{"email": true, "sms": true}'],
        (err, results) => {
            if (err) {
                console.error('Errore nella creazione dell\'utente:', err); // Log dettagliato dell'errore
                return res.status(500).json({ error: 'Errore nella creazione dell\'utente' });
            }
            res.status(201).json({ id: results.insertId, nome, email });
        }
    );
});




/**
 * @swagger
 * /api/utenti/{id}:
 *   put:
 *     summary: Aggiorna un utente specifico
 *     tags: [Utenti]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dell'utente
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       204:
 *         description: Utente aggiornato con successo
 */
app.put('/api/utenti/:id', (req, res) => {
    const { nome, email } = req.body;
    connection.query('UPDATE utenti SET nome = ?, email = ? WHERE id = ?', [nome, email, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'utente' });
        res.status(204).send();
    });
});

/**
 * @swagger
 * /api/utenti/{id}:
 *   delete:
 *     summary: Elimina un utente specifico
 *     tags: [Utenti]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dell'utente
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Utente eliminato con successo
 */
app.delete('/api/utenti/:id', (req, res) => {
    connection.query('DELETE FROM utenti WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
        res.status(204).send();
    });
});

// Implementa simili endpoint per Party, Commenti, Post, Preferiti, e Like...

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});



/**
 * @swagger
 * tags:
 *   name: Eventi
 *   description: Gestione degli eventi
 */