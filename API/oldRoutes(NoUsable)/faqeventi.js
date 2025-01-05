const express = require('express');
const router = express.Router();
const connection = require('../db');

/**
 * @swagger
 * tags:
 *   name: FAQ eventi
 *   description: Gestione dei party
 */

/**
 * @swagger
 * /api/faqeventi:
 *   post:
 *     summary: Crea una nuova FAQ evento
 *     tags: [FAQ eventi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               evento_id:
 *                 type: integer
 *               domanda:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ evento creato
 */
router.post('/api/faqeventi', (req, res) => {
    const {evento_id, domanda} = req.body;

    // Verifica dell'esistenza dell'evento
    connection.query(
        'SELECT id FROM eventi WHERE id = ?', [evento_id],
        (err, results) => {
            if (err) {
                console.error('Errore nella verifica dell\'evento:', err);
                return res.status(500).json({ error: 'Errore interno nella verifica dell\'evento' });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: 'ID evento non valido o non esistente' });
            }

            // Verifica dell'esistenza della categoria
            connection.query(
                'INSERT INTO faq_eventi (evento_id, domanda, risposta) VALUES (?, ?, NULL)',
                [evento_id, domanda],
                    (err, results) => {
                        if (err) {
                            console.error('Errore nella creazione della FAQ evento:', err);
                            return res.status(500).json({ error: 'Errore nella creazione della FAQ evento' });
                        }
                        res.status(201).json({ id: results.insertId });
                    }
            );
        }
    );
});

/**
 * @swagger
 * /api/faqeventi:
 *   patch:
 *     summary: Rispondi ad un FAQ evento
 *     tags: [FAQ eventi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               risposta:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ evento creato
 */
router.patch('/api/faqeventi', (req, res) => {
    const {id, risposta} = req.body;

    // Verifica dell'esistenza dell'evento
    connection.query(
        "UPDATE faq_eventi SET risposta = ? WHERE id = ?",
        [risposta, id],
        (err, results) => {
            if (err) {
                console.error('Errore nell\'aggiunta della risposta alla FAQ evento', err);
                return res.status(500).json({ error: 'Errore nell\'aggiunta della risposta alla FAQ evento' });
            }
            res.status(201).json({ id: results.insertId });
        }
    );
});

/**
 * @swagger
 * /api/faqeventi/{evento_id}:
 *   get:
 *     summary: Recupera tutte le FAQ di un evento
 *     tags: [FAQ eventi]
 *     parameters:
 *       - name: evento_id
 *         in: path
 *         required: true
 *         description: ID dell'evento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: FAQ trovate
 *       404:
 *         description: FAQ non trovate
 */
router.get('/api/faqeventi/:id', (req, res) => {
    connection.query('SELECT * FROM faq_eventi WHERE evento_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del\'party' });
        if (results.length === 0) return res.status(404).json({ error: 'FAQ eventi non trovate' });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/faqeventi/{id}:
 *   delete:
 *     summary: Elimina una FAQ eventi specifica
 *     tags: [FAQ eventi]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID della FAQ evento
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: FAQ eliminata con successo
 */
router.delete('/api/faqeventi/:id', (req, res) => {
    connection.query('DELETE FROM faq_eventi WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione della FAQ evento' });
        res.status(204).send();
    });
});

module.exports = router;