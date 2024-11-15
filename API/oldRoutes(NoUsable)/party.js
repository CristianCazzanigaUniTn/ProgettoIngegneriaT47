const express = require('express');
const router = express.Router();
const connection = require('../db');

/**
 * @swagger
 * tags:
 *   name: Party
 *   description: Gestione dei party
 */

/**
 * @swagger
 * /api/party:
 *   get:
 *     summary: Recupera tutti i party
 *     tags: [Party]
 *     responses:
 *       200:
 *         description: Party trovati
 */
router.get('/api/party', (req, res) => {
    connection.query('SELECT * FROM party', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nel recupero dei party' });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/party/{id}:
 *   get:
 *     summary: Recupera un party specifico
 *     tags: [Party]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del party
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Party trovato
 *       404:
 *         description: Party non trovato
 */
router.get('/api/party/:id', (req, res) => {
    connection.query('SELECT * FROM party WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del\'party' });
        if (results.length === 0) return res.status(404).json({ error: 'Party non trovato' });
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /api/party:
 *   post:
 *     summary: Crea un nuovo party
 *     tags: [Party]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descrizione:
 *                 type: string
 *               data_inizio:
 *                 type: string
 *                 format: date-time
 *               data_fine:
 *                 type: string
 *                 format: date-time
 *               luogo:
 *                 type: string
 *               posizione_geografica:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               numero_massimo_partecipanti:
 *                 type: integer
 *               organizzatore_id:
 *                 type: integer
 *               data_creazione:
 *                 type: string
 *                 format: date-time
 *               id_categoria:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Party creato
 */
router.post('/api/party', (req, res) => {
    const {
        nome, descrizione, data_inizio, data_fine, luogo, posizione_geografica, numero_massimo_partecipanti, organizzatore_id, data_creazione, id_categoria
    } = req.body;

    // Formattazione date
    const formatTimestamp = (dateStr) => new Date(dateStr).toISOString().slice(0, 19).replace('T', ' ');
    const formattedDataInizio = formatTimestamp(data_inizio);
    const formattedDataFine = formatTimestamp(data_fine);
    const formattedDataCreazione = formatTimestamp(data_creazione);

    // Validazione delle coordinate
    const { lat, lng } = posizione_geografica || {};
    if (typeof lat !== 'number' || lat < -90 || lat > 90 || typeof lng !== 'number' || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'Latitudine o longitudine non valida' });
    }
    const posizioneGeografica = `POINT(${lat} ${lng})`;

    // Verifica dell'esistenza dell'organizzatore
    connection.query(
        'SELECT id FROM utenti WHERE id = ? AND ruolo = "utente_base"', [organizzatore_id],
        (err, results) => {
            if (err) {
                console.error('Errore nella verifica dell\'organizzatore:', err);
                return res.status(500).json({ error: 'Errore interno nella verifica dell\'organizzatore' });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: 'ID organizzatore non valido o non esistente' });
            }

            // Verifica dell'esistenza della categoria
            connection.query(
                'SELECT id FROM categoria_contenuto WHERE id = ?', [id_categoria],
                (err, results) => {
                    if (err) {
                        console.error('Errore interno nella verifica della categoria', err);
                        return res.status(500).json({ error: 'Errore interno nella verifica della categoria' });
                    }
                    if (results.length === 0) {
                        return res.status(400).json({ error: 'ID categoria non esistente' });
                    }

                    // Inserimento del party
                    connection.query(
                        'INSERT INTO party (nome, descrizione, data_inizio, data_fine, luogo, posizione_geografica, numero_massimo_partecipanti, organizzatore_id, data_creazione, id_categoria) VALUES (?, ?, ?, ?, ?, ST_GeomFromText(?), ?, ?, ?, ?)',
                        [nome, descrizione, formattedDataInizio, formattedDataFine, luogo, posizioneGeografica, numero_massimo_partecipanti, organizzatore_id, formattedDataCreazione, id_categoria],
                        (err, results) => {
                            if (err) {
                                console.error('Errore nella creazione del\'party:', err);
                                return res.status(500).json({ error: 'Errore nella creazione del\'party' });
                            }
                            res.status(201).json({ id: results.insertId });
                        }
                    );
                }
            );
        }
    );
});

/**
 * @swagger
 * /api/party/{id}:
 *   delete:
 *     summary: Elimina un party specifico
 *     tags: [Party]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del party
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Party eliminato con successo
 */
router.delete('/api/party/:id', (req, res) => {
    connection.query('DELETE FROM party WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione del\'party' });
        res.status(204).send();
    });
});

/**
 * @swagger
 * /api/party/coordinate:
 *   post:
 *     summary: Recupera party in delle coordinate specifiche
 *     tags: [Party]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *                 description: Latitudine del party
 *               lng:
 *                 type: number
 *                 description: Longitudine del party
 *     responses:
 *       200:
 *         description: Lista di party trovati
 *       400:
 *         description: Parametri non validi
 *       404:
 *         description: Nessun party trovato
 */
router.post('/api/party/coordinate', (req, res) => {
    const { lat, lng } = req.body;

    // Convert coordinates to numbers and validate them
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90 ||
        isNaN(longitude) || longitude < -180 || longitude > 180) {
        return res.status(400).json({ error: 'Latitudine o longitudine non valide' });
    }

    const posizioneGeografica = `POINT(${longitude} ${latitude})`; // lng first for WKT

    connection.query(
        'SELECT * FROM party WHERE ST_Equals(posizione_geografica, ST_GeomFromText(?, 4326))', // Usa SRID 4326 per WGS84 (GPS)
        [posizioneGeografica],
        (err, results) => {
            if (err) {
                console.error('Errore nel recupero del party:', err);
                return res.status(500).json({ error: 'Errore nel recupero del party' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Party non trovato' });
            }
            res.json(results);
        }
    );
});

/**
 * @swagger
 * /api/party/ricerca:
 *   post:
 *     summary: Recupera party in un raggio specifico
 *     tags: [Party]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *                 description: Latitudine del party
 *               lng:
 *                 type: number
 *                 description: Longitudine del party
 *               rad:
 *                 type: number
 *                 description: Raggio di ricerca
 *     responses:
 *       200:
 *         description: Lista di party trovati
 *       400:
 *         description: Parametri non validi
 *       404:
 *         description: Nessun party trovato nel raggio specificato
 */
router.post('/api/party/ricerca', (req, res) => {
    const { lat, lng, rad } = req.body;

    // Convert the parameters to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const raggio = parseFloat(rad);

    // Validazione delle coordinate e del raggio
    if (isNaN(latitude) || latitude < -90 || latitude > 90 ||
        isNaN(longitude) || longitude < -180 || longitude > 180 ||
        isNaN(raggio) || raggio < 0) {
        return res.status(400).json({ error: 'Latitudine, longitudine o raggio non valido' });
    }

    // Convert the radius from kilometers to meters for the query
    const raggioInMetri = raggio * 1000;
    const posizioneGeografica = `POINT(${lat} ${lng})`;

    // Use ST_Distance_Sphere for spherical distance
    connection.query(
        `SELECT * FROM party WHERE ST_Distance_Sphere(posizione_geografica, ST_GeomFromText(?)) <= ?`,
        [posizioneGeografica, raggioInMetri], // Ensure that lng comes first for POINT
        (err, results) => {
            if (err) {
                console.error('Errore nella query:', err);
                return res.status(500).json({ error: 'Errore nel recupero dei party' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nessun party trovato nel raggio specificato' });
            }
            res.json(results);
        }
    );
});

/**
 * @swagger
 * /api/party/organizzatore/{organizzatore_id}:
 *   get:
 *     summary: Recupera i party creati dallo stesso organizzatore
 *     tags: [Party]
 *     parameters:
 *       - name: organizzatore_id
 *         in: path
 *         required: true
 *         description: ID dell'organizzatore
 *     responses:
 *       200:
 *         description: Party trovati
 *       404:
 *         description: Party non trovati
 */
router.get('/api/party/organizzatore/:organizzatore_id', (req, res) => {
    
    connection.query('SELECT * FROM party WHERE organizzatore_id = ?', [req.params.organizzatore_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dei\'party' });
        if (results.length === 0) return res.status(404).json({ error: 'Party non trovati' });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/party/categoria/{categoria}:
 *   get:
 *     summary: Recupera i party in base alla categoria
 *     tags: [Party]
 *     parameters:
 *       - name: categoria
 *         in: path
 *         required: true
 *         description: Categoria del party
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Party trovati
 *       404:
 *         description: Party non trovati
 */
router.get('/api/party/categoria/:categoria', (req, res) => {
    const categoriaId = req.params.categoria;
    connection.query('SELECT * FROM party WHERE id_categoria = ?', [categoriaId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dei party' });
        if (results.length === 0) return res.status(404).json({ error: 'Party non trovati' });
        res.json(results);
    });
});


module.exports = router;