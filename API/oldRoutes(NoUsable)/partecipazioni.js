const express = require('express');
const router = express.Router();
const connection = require('../db');
/**
 * @swagger
 * tags:
 *   name: Partecipazioni
 *   description: Gestione delle partecipazione
 */

/**
 * @swagger
 * /api/Partecipazioni/Eventi/{id}:
 *   get:
 *     summary: Recupera utenti partecipanti ad un evento
 *     tags: [Partecipazioni]
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
router.get('/api/Partecipazioni/Eventi/:id', (req, res) => {
    connection.query('SELECT * FROM eventi WHERE id = ?', [req.params.id], (err, eventiResults) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero dell\'evento' });
        if (eventiResults.length === 0) {
            return res.status(404).json({ error: 'Evento non trovato' });
        }
        connection.query(
            'SELECT u.* FROM utenti u JOIN partecipazioni p ON u.id = p.utente_id WHERE p.evento_id = ?',
            [req.params.id],
            (err, partecipantiResults) => {
                if (err) return res.status(500).json({ error: 'Errore nel recupero dei partecipanti' });
                if (partecipantiResults.length === 0) {
                    return res.json({ message: 'Evento trovato, ma non ha partecipanti' });
                }
                res.json(partecipantiResults);
            }
        );
    });
});

/**
 * @swagger
 * /api/Partecipazioni/Party/{id}:
 *   get:
 *     summary: Recupera utenti partecipanti ad un party
 *     tags: [Partecipazioni]
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
router.get('/api/Partecipazioni/Party/:id', (req, res) => {
    connection.query('SELECT * FROM party WHERE id = ?', [req.params.id], (err, partyResults) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del\'party' });
        if (partyResults.length === 0) {
            return res.status(404).json({ error: 'party non trovato' });
        }
        connection.query(
            'SELECT u.* FROM utenti u JOIN partecipazione_party_utente p ON u.id = p.utente_id WHERE p.party_id = ?',
            [req.params.id],
            (err, partecipantiResults) => {
                if (err) return res.status(500).json({ error: 'Errore nel recupero dei partecipanti' });
                if (partecipantiResults.length === 0) {
                    return res.json({ message: 'Party trovato, ma non ha partecipanti' });
                }
                res.json(partecipantiResults);
            }
        );
    });
});

/**
 * @swagger
 * /api/Partecipazioni/Eventi:
 *   post:
 *     summary: Crea un nuovo utente
 *     tags: [Partecipazioni]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utenteId:
 *                 type: string
 *               eventoId:
 *                 type: string
 *     responses:
 *       409:
 *         description: La partecipazione esiste già
 *       408: 
 *         description: Numero massimo di partecipanti raggiunto
 *       500: 
 *         description: Errore nel recupero di un id
 *       201:
 *         description: Partecipazione accettata
 *   
 */
router.post('/api/Partecipazioni/Eventi', (req, res) => {
    const { utenteId, eventoId } = req.body;
    connection.query(
        'SELECT p.id FROM partecipazioni p WHERE p.utente_id = ? AND p.evento_id = ?', 
        [utenteId, eventoId], 
        (err, eventiResults) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero della partecipazione" });
            if (eventiResults.length > 0) {
                return res.status(409).json({ error: 'La partecipazione esiste già' });
            }


            connection.query(
                'SELECT numero_massimo_partecipanti FROM eventi WHERE id = ?', 
                [eventoId], 
                (err, eventoResults) => {
                    if (err) return res.status(500).json({ error: "Errore nel recupero dell'evento" });
                    if (eventoResults.length === 0) {
                        return res.status(404).json({ error: 'Evento non trovato' });
                    }
                    const numeroMassimoPartecipanti = eventoResults[0].numero_massimo_partecipanti;


                    connection.query(
                        'SELECT COUNT(*) AS numPartecipanti FROM partecipazioni WHERE evento_id = ?', 
                        [eventoId], 
                        (err, countResults) => {
                            if (err) return res.status(500).json({ error: "Errore nel conteggio dei partecipanti" });
                            const numPartecipanti = countResults[0].numPartecipanti;
                            if (numPartecipanti >= numeroMassimoPartecipanti) {
                                return res.status(408).json({ error: 'Numero massimo di partecipanti raggiunto' });
                            }


                            connection.query(
                                'INSERT INTO partecipazioni (utente_id, evento_id, data_partecipazione) VALUES (?, ?, NOW())', 
                                [utenteId, eventoId],
                                (err, results) => {
                                    if (err) {
                                        console.error('Errore nella creazione della partecipazione:', err); 
                                        return res.status(500).json({ error: 'Errore nella creazione della partecipazione' });
                                    }
                                    res.status(201).json({ id: results.insertId });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

/**
 * @swagger
 * /api/Partecipazioni/Party:
 *   post:
 *     summary: Crea un nuovo utente
 *     tags: [Partecipazioni]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utenteId:
 *                 type: string
 *               partyId:
 *                 type: string
 *     responses:
 *       409:
 *         description: La partecipazione esiste già
 *       408: 
 *         description: Numero massimo di partecipanti raggiunto
 *       500: 
 *         description: Errore nel recupero di un id
 *       201:
 *         description: Partecipazione accettata
 *   
 */
router.post('/api/Partecipazioni/Party', (req, res) => {
    const { utenteId, partyId } = req.body;
    connection.query(
        'SELECT p.id FROM partecipazione_party_utente p WHERE p.utente_id = ? AND p.party_id = ?', 
        [utenteId, partyId], 
        (err, partiesResults) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero della partecipazione" });
            if (partiesResults.length > 0) {
                return res.status(409).json({ error: 'La partecipazione esiste già' });
            }


            connection.query(
                'SELECT numero_massimo_partecipanti FROM party WHERE id = ?', 
                [partyId], 
                (err, partyResults) => {
                    if (err) return res.status(500).json({ error: "Errore nel recupero del party" });
                    if (partyResults.length === 0) {
                        return res.status(404).json({ error: 'Party non trovato' });
                    }
                    const numeroMassimoPartecipanti = partyResults[0].numero_massimo_partecipanti;


                    connection.query(
                        'SELECT COUNT(*) AS numPartecipanti FROM partecipazione_party_utente WHERE party_id = ?', 
                        [partyId], 
                        (err, countResults) => {
                            if (err) return res.status(500).json({ error: "Errore nel conteggio dei partecipanti" });
                            const numPartecipanti = countResults[0].numPartecipanti;
                            if (numPartecipanti >= numeroMassimoPartecipanti) {
                                return res.status(408).json({ error: 'Numero massimo di partecipanti raggiunto' });
                            }


                            connection.query(
                                'INSERT INTO partecipazione_party_utente (utente_id, party_id, data_partecipazione) VALUES (?, ?, NOW())', 
                                [utenteId, partyId],
                                (err, results) => {
                                    if (err) {
                                        console.error('Errore nella creazione della partecipazione:', err); 
                                        return res.status(500).json({ error: 'Errore nella creazione della partecipazione' });
                                    }
                                    res.status(201).json({ id: results.insertId });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

/**
 * @swagger
 * /api/Partecipazioni/Eventi/:
 *   delete:
 *     summary: Elimina un utente specifico
 *     tags: [Partecipazioni]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utenteId:
 *                 type: string
 *               eventoId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Utente eliminato con successo
 *       500:
 *         description: Errore nell'eliminazione dell'utente
 */

router.delete('/api/Partecipazioni/Eventi/', (req, res) => {
    const { utenteId, eventoId } = req.body;
    if (!utenteId || !eventoId) {
        return res.status(400).json({ error: 'utenteId ed eventoId sono richiesti' });
    }
    connection.query('DELETE FROM partecipazioni WHERE utente_id = ? AND evento_id = ?', [utenteId, eventoId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore nell\'eliminazione della\ Partecipazione' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Nessuna partecipazione trovata per l\'utente e l\'evento forniti' });
        }
        res.status(204).send();
    });
});

/**
 * @swagger
 * /api/Partecipazioni/Party/:
 *   delete:
 *     summary: Elimina un utente specifico
 *     tags: [Partecipazioni]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utenteId:
 *                 type: string
 *               partyId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Utente eliminato con successo
 *       500:
 *         description: Errore nell'eliminazione dell'utente
 */

router.delete('/api/Partecipazioni/Party/', (req, res) => {
    const { utenteId, partyId } = req.body;
    if (!utenteId || !partyId) {
        return res.status(400).json({ error: 'utenteId ed partyId sono richiesti' });
    }
    connection.query('DELETE FROM partecipazione_party_utente WHERE utente_id = ? AND party_id = ?', [utenteId, partyId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore nell\'eliminazione della\ Partecipazione' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Nessuna partecipazione trovata per l\'utente e il party forniti' });
        }
        res.status(204).send();
    });
});

/**
 * @swagger
 * /api/Partecipazioni/EventiCount:
 *   get:
 *     summary: Recupera id evento e count partecipanti in ordine decrescente
 *     tags: [Partecipazioni]
 *     responses:
 *       200:
 *         description: Lista di eventi con partecipanti
 *       500:
 *         description: Errore nel recupero delle partecipazioni
 */
router.get('/api/Partecipazioni/EventiCount', (req, res) => {
    connection.query('SELECT p.evento_id , COUNT(p.utente_id) AS partecipanti FROM partecipazioni p GROUP BY p.evento_id ORDER BY count(p.utente_id) DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero delle partecipazioni' });
        res.json(results);
    });
});

/**
 * @swagger
 * /api/Partecipazioni/PartyCount:
 *   get:
 *     summary: Recupera id party e count partecipanti in ordine decrescente
 *     tags: [Partecipazioni]
 *     responses:
 *       200:
 *         description: Lista di party con partecipanti
 *       500:
 *         description: Errore nel recupero delle partecipazioni
 */
router.get('/api/Partecipazioni/PartyCount', (req, res) => {
    connection.query('SELECT p.party_id, COUNT(p.utente_id) AS partecipanti FROM partecipazione_party_utente p GROUP BY p.party_id ORDER BY COUNT(p.utente_id) DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore nel recupero delle partecipazioni' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Nessun party trovato' }); 
        }
        
        res.json(results);
    });
});

module.exports = router;