const express = require('express');
const router = express.Router();
const connection = require('../db');


/**
 * @swagger
 * tags:
 *   name: Eventi
 *   description: Gestione degli eventi
 */


/**
 * @swagger
 * /api/eventi:
 *   get:
 *     summary: Recupera tutti gli eventi
 *     tags: [Eventi]
 *     responses:
 *       200:
 *         description: Eventi trovati
 */
router.get('/api/eventi', (req, res) => {
    connection.query('SELECT * FROM eventi', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nel recupero degli eventi' });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/eventi/{id}:
 *   get:
 *     summary: Recupera un evento specifico
 *     tags: [Eventi]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dell'evento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento trovato
 *       404:
 *         description: Evento non trovato
 */
router.get('/api/eventi/:id', (req, res) => {
    connection.query('SELECT * FROM eventi WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dell\'evento' });
        if (results.length === 0) return res.status(404).json({ error: 'Evento non trovato' });
        res.json(results[0]);
    });
});

/**
 * @swagger
 * /api/eventi:
 *   post:
 *     summary: Crea un nuovo evento
 *     tags: [Eventi]
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
 *         description: Evento creato
 */
router.post('/api/eventi', (req, res) => {
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
        'SELECT id FROM utenti WHERE id = ? AND ruolo = "organizzatore"', [organizzatore_id],
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

                    // Inserimento dell'evento
                    connection.query(
                        'INSERT INTO eventi (nome, descrizione, data_inizio, data_fine, luogo, posizione_geografica, numero_massimo_partecipanti, organizzatore_id, data_creazione, id_categoria) VALUES (?, ?, ?, ?, ?, ST_GeomFromText(?), ?, ?, ?, ?)',
                        [nome, descrizione, formattedDataInizio, formattedDataFine, luogo, posizioneGeografica, numero_massimo_partecipanti, organizzatore_id, formattedDataCreazione, id_categoria],
                        (err, results) => {
                            if (err) {
                                console.error('Errore nella creazione dell\'evento:', err);
                                return res.status(500).json({ error: 'Errore nella creazione dell\'evento' });
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
 * /api/eventi/{id}:
 *   delete:
 *     summary: Elimina un evento specifico
 *     tags: [Eventi]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dell'evento
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Utente eliminato con successo
 */
router.delete('/api/eventi/:id', (req, res) => {
    connection.query('DELETE FROM eventi WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione dell\'evento' });
        res.status(204).send();
    });
});

/**
 * @swagger
 * /api/eventi/coordinate:
 *   post:
 *     summary: Recupera eventi in delle coordinate specifiche
 *     tags: [Eventi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *                 description: Latitudine dell'evento
 *               lng:
 *                 type: number
 *                 description: Longitudine dell'evento
 *     responses:
 *       200:
 *         description: Lista degli eventi trovati
 *       400:
 *         description: Parametri non validi
 *       404:
 *         description: Nessun evento trovato
 */
router.post('/api/eventi/coordinate', (req, res) => {
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
        'SELECT * FROM eventi WHERE ST_Equals(posizione_geografica, ST_GeomFromText(?, 4326))', // Usa SRID 4326 per WGS84 (GPS)
        [posizioneGeografica],
        (err, results) => {
            if (err) {
                console.error('Errore nel recupero degli eventi:', err);
                return res.status(500).json({ error: 'Errore nel recupero degli eventi' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Evento non trovato' });
            }
            res.json(results);
        }
    );
});

/**
 * @swagger
 * /api/eventi/ricerca:
 *   post:
 *     summary: Recupera eventi in un raggio specifico
 *     tags: [Eventi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lat:
 *                 type: number
 *                 description: Latitudine dell'evento
 *               lng:
 *                 type: number
 *                 description: Longitudine dell'evento
 *               rad:
 *                 type: number
 *                 description: Raggio di ricerca
 *     responses:
 *       200:
 *         description: Lista degli eventi trovati
 *       400:
 *         description: Parametri non validi
 *       404:
 *         description: Nessun evento trovato nel raggio specificato
 */
router.post('/api/eventi/ricerca', (req, res) => {
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
        `SELECT * FROM eventi WHERE ST_Distance_Sphere(posizione_geografica, ST_GeomFromText(?)) <= ?`,
        [posizioneGeografica, raggioInMetri], // Ensure that lng comes first for POINT
        (err, results) => {
            if (err) {
                console.error('Errore nella query:', err);
                return res.status(500).json({ error: 'Errore nel recupero degli eventi' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nessun evento trovato nel raggio specificato' });
            }
            res.json(results);
        }
    );
});

/**
 * @swagger
 * /api/eventi/organizzatore/{organizzatore_id}:
 *   get:
 *     summary: Recupera gli eventi creati dallo stesso organizzatore
 *     tags: [Eventi]
 *     parameters:
 *       - name: organizzatore_id
 *         in: path
 *         required: true
 *         description: ID dell'organizzatore
 *     responses:
 *       200:
 *         description: Eventi trovati
 *       404:
 *         description: Eventi non trovati
 */
router.get('/api/eventi/organizzatore/:organizzatore_id', (req, res) => {
    
    connection.query('SELECT * FROM eventi WHERE organizzatore_id = ?', [req.params.organizzatore_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero degli\'eventi' });
        if (results.length === 0) return res.status(404).json({ error: 'Eventi non trovati' });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/eventi/categoria/{categoria}:
 *   get:
 *     summary: Recupera gli eventi in base alla categoria
 *     tags: [Eventi]
 *     parameters:
 *       - name: categoria
 *         in: path
 *         required: true
 *         description: Categoria dell'evento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eventi trovati
 *       404:
 *         description: Eventi non trovati
 */
router.get('/api/eventi/categoria/:categoria', (req, res) => {
    const categoriaId = req.params.categoria;
    connection.query('SELECT * FROM eventi WHERE id_categoria = ?', [categoriaId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero degli eventi' });
        if (results.length === 0) return res.status(404).json({ error: 'Eventi non trovati' });
        res.json(results);
    });
});


module.exports = router;