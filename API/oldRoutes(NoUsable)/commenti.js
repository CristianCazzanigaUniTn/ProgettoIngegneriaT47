const express = require('express');
const router = express.Router();
const connection = require('../db');

/**
 * @swagger
 * tags:
 *   name: Commenti
 *   description: Gestione dei commenti
 */


/**
 * @swagger
 * /api/Commenti/{id}:
 *   get:
 *     summary: Recupera un commento specifico tramite ID
 *     tags: [Commenti]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del commento da recuperare
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dettagli del commento
 *       404:
 *         description: Commento non trovato
 *       500:
 *         description: Errore durante il recupero del commento
 */
router.get('/api/Commenti/:id', (req, res) => {
    const commentoId = req.params.id;
    connection.query(
        'SELECT * FROM commenti WHERE id = ?',
        [commentoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Errore nel recupero del commento' });
            if (results.length === 0) {
                return res.status(404).json({ error: 'Commento non trovato' });
            }
            res.status(200).json(results[0]); // Restituisce il primo risultato come singolo oggetto
        }
    );
});



/**
 * @swagger
 * /api/Commenti/Post/{id}:
 *   get:
 *     summary: Recupera utenti partecipanti ad un evento
 *     tags: [Commenti]
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
router.get('/api/Commenti/Post/:id', (req, res) => {
    connection.query('SELECT * FROM post WHERE id = ?', [req.params.id], (err, eventiResults) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del Post' });
        if (eventiResults.length === 0) {
            return res.status(404).json({ error: 'Post non trovato' });
        }
        connection.query(
            'SELECT c.* FROM commenti c JOIN post p ON c.post_id = p.id WHERE p.id = ?',
            [req.params.id],
            (err, partecipantiResults) => {
                if (err) return res.status(500).json({ error: 'Errore nel recupero dei commenti' });
                if (partecipantiResults.length === 0) {
                    return res.json({ message: 'Post trovato, ma non ha commenti' });
                }
                res.json(partecipantiResults);
            }
        );
    });
});

/**
 * @swagger
 * /api/Commenti:
 *   post:
 *     summary: Crea un nuovo commento
 *     tags: [Commenti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utente_id:
 *                 type: integer
 *                 description: ID dell'utente che crea il commento
 *               post_id:
 *                 type: integer
 *                 description: ID del post su cui si commenta
 *               contenuto:
 *                 type: string
 *                 description: Contenuto del commento
 *     responses:
 *       201:
 *         description: Commento creato con successo
 *       400:
 *         description: Dati mancanti o non validi
 */
router.post('/api/Commenti', (req, res) => {
    const { utente_id, post_id, contenuto } = req.body;
    if (!utente_id || !post_id || !contenuto) {
        return res.status(400).json({ error: 'Dati mancanti: utente_id, post_id e contenuto sono obbligatori' });
    }
    const nuovoCommento = [utente_id, post_id, contenuto];
    connection.query(
        'INSERT INTO commenti (utente_id, post_id, contenuto, data_creazione) VALUES (?, ?, ?, NOW())',
        nuovoCommento,
        (err, result) => {
            if (err) {
                console.error('Errore nella query:', err);
                return res.status(500).json({ error: 'Errore nella creazione del commento' });
            }
            res.status(201).json({ message: 'Commento creato con successo', commento_id: result.insertId });
        }
    );
});

/**
 * @swagger
 * /api/Commenti/{id}:
 *   delete:
 *     summary: Elimina un commento
 *     tags: [Commenti]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del commento da eliminare
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID dell'utente che richiede l'eliminazione
 *     responses:
 *       200:
 *         description: Commento eliminato con successo
 *       403:
 *         description: Non autorizzato a eliminare questo commento
 *       404:
 *         description: Commento non trovato
 *       400:
 *         description: Richiesta non valida
 *       500:
 *         description: Errore del server
 */
router.delete('/api/Commenti/:id', (req, res) => {
    const commentoId = req.params.id;
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: 'user_id è obbligatorio per l\'eliminazione' });
    }
    connection.query('SELECT utente_id FROM commenti WHERE id = ?', [commentoId], (err, results) => {
        if (err) {
            console.error('Errore durante la ricerca del commento:', err);
            return res.status(500).json({ error: 'Errore durante la ricerca del commento' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Commento non trovato' });
        }
        const proprietarioId = results[0].utente_id;
        if (proprietarioId !== user_id) {
            return res.status(403).json({ error: 'Non autorizzato a eliminare questo commento' });
        }
        connection.query('DELETE FROM commenti WHERE id = ?', [commentoId], (err, result) => {
            if (err) {
                console.error('Errore durante l\'eliminazione del commento:', err);
                return res.status(500).json({ error: 'Errore durante l\'eliminazione del commento' });
            }
            res.status(200).json({ message: 'Commento eliminato con successo' });
        });
    });
});


module.exports = router;
