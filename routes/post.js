const express = require('express');
const router = express.Router();
const connection = require('../db');

// ---------------------------------------------
//  API per Post
// ---------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Gestione dei post
 */

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Recupera tutti i post
 *     tags: [Post]
 *     description: Lista di post
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               utente_id:
 *                 type: integer
 *               titolo:
 *                 type: string
 *               contenuto:
 *                 type: string
 *               data_creazione:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Post trovati
 *       404:
 *         description: Post non trovati
 */
router.get('/api/post', (req, res) => {
    connection.query('SELECT * FROM post', (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dei post' });
        res.json(results);
    });
});

router.get('/api/post', (req, res) => {
    connection.query('SELECT * FROM post', (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dei post' });
        res.json(results);
    });
});



/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     summary: Recupera un post specifico dato l'ID
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: integer
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             utente_id:
 *               type: integer
 *             titolo:
 *               type: string
 *             contenuto:
 *               type: string
 *             data_creazione:
 *               type: string
 *               format: date-time
 *     responses:
 *       200:
 *         description: Post trovato
 *       404:
 *         description: Post non trovato
 */
router.get('/api/post/:id', (req, res) => {
    const postId = req.params.id;
    connection.query('SELECT * FROM post WHERE id = ?', [postId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del post' });
        if (results.length === 0) return res.status(404).json({ error: 'Post non trovato' });
        res.status(200).json(results[0]);
    });
});



/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Crea un nuovo post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utente_id:
 *                 type: integer
 *                 description: ID dell'utente che crea il post
 *               titolo:
 *                 type: string
 *                 description: Titolo del post
 *               contenuto:
 *                 type: string
 *                 description: Contenuto del post
 *               data_creazione:
 *                 type: string
 *                 format: date-time
 *                 description: Data di creazione del post
 *     responses:
 *       201:
 *         description: Post creato con successo
 *       400:
 *         description: Dati del post mancanti o non validi
 *       500:
 *         description: Errore nella creazione del post
 */

router.post('/api/post', (req, res) => {
    const { utente_id, titolo, contenuto, data_creazione } = req.body;

    if (!utente_id || !titolo || !contenuto || !data_creazione) {
        return res.status(400).json({ error: 'Dati mancanti o non validi' });
    }

    connection.query(
        'INSERT INTO post (utente_id, titolo, contenuto, data_creazione) VALUES (?, ?, ?, NOW())',
        [utente_id, titolo, contenuto],
        (err, results) => {
            if (err) {
                console.error('Errore nella creazione del post:', err);
                return res.status(500).json({ error: 'Errore nella creazione del post' });
            }
            res.status(201).json({
                id: results.insertId,
                utente_id,
                titolo,
                contenuto,
                data_creazione,
            });
        }
    );
});

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Elimina un post specifico
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utente_id:
 *                 type: integer
 *                 description: ID dell'utente che richiede l'eliminazione
 *     responses:
 *       204:
 *         description: Post eliminato con successo
 *       403:
 *         description: L'utente non è autorizzato a eliminare questo post
 *       404:
 *         description: Post non trovato
 *       500:
 *         description: Errore nell'eliminazione del post
 */
router.delete('/api/post/:id', (req, res) => {
    const postId = req.params.id;
    const { utente_id } = req.body;

    // Controlla se l'utente è il proprietario del post
    connection.query('SELECT utente_id FROM post WHERE id = ?', [postId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del post' });
        if (results.length === 0) return res.status(404).json({ error: 'Post non trovato' });

        const postOwnerId = results[0].utente_id;
        if (postOwnerId !== utente_id) {
            return res.status(403).json({ error: 'Non autorizzato a eliminare questo post' });
        }

        // Elimina il post se l'utente è il proprietario
        connection.query('DELETE FROM post WHERE id = ?', [postId], (err) => {
            if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione del post' });
            res.status(204).send();
        });
    });
});



/**
 * @swagger
 * /api/postluogo:
 *   get:
 *     summary: Recupera i post in base alle coordinate geografiche
 *     tags: [Post]
 *     parameters:
 *       - name: latitudine
 *         in: query
 *         required: true
 *         description: Latitudine del luogo
 *         schema:
 *           type: number
 *       - name: longitudine
 *         in: query
 *         required: true
 *         description: Longitudine del luogo
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista di post trovati
 *       400:
 *         description: Coordinate mancanti o non valide
 *       500:
 *         description: Errore nel recupero dei post
 */
router.get('/api/postluogo', (req, res) => {
    const { latitudine, longitudine } = req.query;

    if (!latitudine || !longitudine) {
        return res.status(400).json({ error: 'Coordinate mancanti o non valide' });
    }

    connection.query(
        'SELECT * FROM post WHERE ST_X(posizione_geografica) = ? AND  ST_Y(posizione_geografica)= ?',
        [latitudine, longitudine],
        (err, results) => {
            if (err) {
                console.error('Errore nel recupero dei post:', err);
                return res.status(500).json({ error: 'Errore nel recupero dei post' });
            }
            res.status(200).json(results);
        }
    );
});

/**
 * @swagger
 * /api/post/utente/{id}:
 *   get:
 *     summary: Recupera i post di un utente specifico
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dell'utente di cui recuperare i post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post trovati per l'utente
 *       404:
 *         description: Nessun post trovato per l'utente
 *       500:
 *         description: Errore nel recupero dei post
 */
router.get('/api/post/utente/:id', (req, res) => {
    const idUtente = req.params.id; // Use 'id' instead of 'idUtente'

    connection.query('SELECT * FROM post WHERE utente_id = ?', [idUtente], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dei post' });
        if (results.length === 0) return res.status(404).json({ error: 'Nessun post trovato per l\'utente' });
        res.status(200).json(results);
    });
});



module.exports = router;
