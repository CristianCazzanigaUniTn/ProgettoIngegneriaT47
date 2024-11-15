const express = require('express');
const router = express.Router();
const connection = require('../db');


/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Gestione dei like
 */


/**
 * @swagger
 * /api/Likes/Post/{idPost}:
 *   get:
 *     summary: Ottiene tutti i like per un determinato post
 *     tags: [Likes]
 *     parameters:
 *       - name: idPost
 *         in: path
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista di like per il post
 *       404:
 *         description: Nessun like trovato per il post
 */
router.get('/api/Likes/Post/:idPost', (req, res) => {
    const { idPost } = req.params;

    connection.query(
        'SELECT * FROM likes WHERE post_id = ? AND commento_id IS NULL',
        [idPost],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Errore nel recupero dei like' });
            if (results.length === 0) {
                return res.status(404).json({ error: 'Nessun like trovato per il post' });
            }
            res.json(results);
        }
    );
});



/**
 * @swagger
 * /api/Likes/Post/{id}:
 *   post:
 *     summary: Aggiungi un like a un post, massimo 1 per utente
 *     tags: [Likes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del post da likare
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
 *                 description: ID dell'utente che mette il like
 *     responses:
 *       201:
 *         description: Like aggiunto con successo
 *       409:
 *         description: Like già esistente per questo post da parte dell'utente
 *       404:
 *         description: Post non trovato
 *       500:
 *         description: Errore nel processo di like
 */
router.post('/api/Likes/Post/:id', (req, res) => {
    const postId = req.params.id;
    const { utente_id } = req.body;
    if (!utente_id) {
        return res.status(400).json({ error: 'utente_id è obbligatorio' });
    }
    connection.query(
        'SELECT id FROM post WHERE id = ?',
        [postId],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Errore nel controllo del post' });
            if (results.length === 0) {
                return res.status(404).json({ error: 'Post non trovato' });
            }
            connection.query(
                'SELECT * FROM likes WHERE utente_id = ? AND post_id = ?',
                [utente_id, postId],
                (err, results) => {
                    if (err) return res.status(500).json({ error: 'Errore nel controllo del like' });
                    if (results.length > 0) {
                        return res.status(409).json({ error: 'Hai già messo un like a questo post' });
                    }
                    connection.query(
                        'INSERT INTO likes (utente_id, post_id, data_creazione) VALUES (?, ?, NOW())',
                        [utente_id, postId],
                        (err, result) => {
                            if (err) return res.status(500).json({ error: 'Errore nell\'aggiunta del like' });
                            res.status(201).json({ message: 'Like aggiunto con successo' });
                        }
                    );
                }
            );
        }
    );
});



/**
 * @swagger
 * /api/Likes/Commento/{idCommento}:
 *   get:
 *     summary: Ottiene tutti i like per un determinato commento
 *     tags: [Likes]
 *     parameters:
 *       - name: idCommento
 *         in: path
 *         required: true
 *         description: ID del commento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista di like per il commento
 *       404:
 *         description: Nessun like trovato per il commento
 *       400:
 *         description: Commento non trovato
 */
router.get('/api/Likes/Commento/:idCommento', (req, res) => {
    const { idCommento } = req.params;
    connection.query(
        'SELECT * FROM commenti WHERE id = ?', 
        [idCommento],
        (err, commentoResults) => {
            if (err) {
                return res.status(500).json({ error: 'Errore nel recupero del commento' });
            }
            if (commentoResults.length === 0) {
                return res.status(404).json({ error: 'Commento non trovato' }); 
            }
            connection.query(
                'SELECT * FROM likes WHERE commento_id = ? AND post_id IS NULL',
                [idCommento],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: 'Errore nel recupero dei like' });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({ error: 'Nessun like trovato per il commento' });
                    }
                    res.json(results); 
                }
            );
        }
    );
});




/**
 * @swagger
 * /api/Likes/Commenti/{id}:
 *   post:
 *     summary: Aggiungi un like a un commento, massimo 1 per utente
 *     tags: [Likes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del commento da likare
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
 *                 description: ID dell'utente che mette il like
 *     responses:
 *       201:
 *         description: Like aggiunto con successo
 *       409:
 *         description: Like già esistente per questo commento da parte dell'utente
 *       404:
 *         description: Commento non trovato
 *       500:
 *         description: Errore nel processo di like
 */
router.post('/api/Likes/Commenti/:id', (req, res) => {
    const commentoId = req.params.id;
    const { utente_id } = req.body;
    if (!utente_id) {
        return res.status(400).json({ error: 'utente_id è obbligatorio' });
    }
    connection.query(
        'SELECT id FROM commenti WHERE id = ?',
        [commentoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Errore nel controllo del commento' });
            if (results.length === 0) {
                return res.status(404).json({ error: 'Commento non trovato' });
            }
            connection.query(
                'SELECT * FROM likes WHERE utente_id = ? AND commento_id = ?',
                [utente_id, commentoId],
                (err, results) => {
                    if (err) return res.status(500).json({ error: 'Errore nel controllo del like' });
                    if (results.length > 0) {
                        return res.status(409).json({ error: 'Hai già messo un like a questo commento' });
                    }
                    connection.query(
                        'INSERT INTO likes (utente_id, commento_id, data_creazione) VALUES (?, ?, NOW())',
                        [utente_id, commentoId],
                        (err, result) => {
                            if (err) return res.status(500).json({ error: 'Errore nell\'aggiunta del like' });
                            res.status(201).json({ message: 'Like aggiunto con successo' });
                        }
                    );
                }
            );
        }
    );
});





/**
 * @swagger
 * /api/Likes/{id}:
 *   delete:
 *     summary: Elimina un like
 *     tags: [Likes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del like da eliminare
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
 *       200:
 *         description: Like eliminato con successo
 *       403:
 *         description: Non autorizzato a eliminare questo like
 *       404:
 *         description: Like non trovato
 */
router.delete('/api/Likes/:id', (req, res) => {
    const likeId = req.params.id;
    const { utente_id } = req.body;

    connection.query('SELECT utente_id FROM likes WHERE id = ?', [likeId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore durante la ricerca del like' });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Like non trovato' });
        }

        if (results[0].utente_id !== utente_id) {
            return res.status(403).json({ error: 'Non autorizzato a eliminare questo like' });
        }

        connection.query('DELETE FROM likes WHERE id = ?', [likeId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Errore durante l\'eliminazione del like' });
            res.json({ message: 'Like eliminato con successo' });
        });
    });
});

/**
 * @swagger
 * /api/Likes/Count/Post/{idPost}:
 *   get:
 *     summary: Ottiene il numero di like per un post specifico
 *     tags: [Likes]
 *     parameters:
 *       - name: idPost
 *         in: path
 *         required: true
 *         description: ID del post per il quale ottenere il conteggio dei like
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteggio dei like per il post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numeroLikes:
 *                   type: integer
 *                   description: Numero di like
 *       404:
 *         description: Nessun like trovato per il post
 */
router.get('/api/Likes/Count/Post/:idPost', (req, res) => {
    const { idPost } = req.params;

    connection.query(
        'SELECT COUNT(*) AS numeroLikes FROM likes WHERE post_id = ? AND commento_id IS NULL',
        [idPost],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Errore nel conteggio dei like' });
            res.json(results[0]);
        }
    );
});


/**
 * @swagger
 * /api/Likes/Count/Commento/{idCommento}:
 *   get:
 *     summary: Ottiene il numero di like per un commento specifico
 *     tags: [Likes]
 *     parameters:
 *       - name: idCommento
 *         in: path
 *         required: true
 *         description: ID del commento per il quale ottenere il conteggio dei like
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteggio dei like per il commento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numeroLikes:
 *                   type: integer
 *                   description: Numero di like
 *       404:
 *         description: Nessun like trovato per il commento
 */
router.get('/api/Likes/Count/Commento/:idCommento', (req, res) => {
    const { idCommento } = req.params;

    connection.query(
        'SELECT COUNT(*) AS numeroLikes FROM likes WHERE commento_id = ? AND post_id IS NULL',
        [idCommento],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Errore nel conteggio dei like' });
            res.json(results[0]);
        }
    );
});


module.exports = router;
