const express = require('express');
const router = express.Router();
const connection = require('../db'); 
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
router.get('/api/utenti', (req, res) => {
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
router.get('/api/utenti/:id', (req, res) => {
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               ruolo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente creato
 */
router.post('/api/utenti', (req, res) => {
    const { nome, email, password, ruolo } = req.body;
    connection.query(
        'INSERT INTO utenti (nome, email, password, data_registrazione, ruolo, preferenze_notifica) VALUES (?, ?, ?, NOW(), ?, ?)', 
        [nome, email, password, ruolo, '{"email": true, "sms": true}'],
        (err, results) => {
            if (err) {
                console.error('Errore nella creazione dell\'utente:', err); 
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
 *       500:
 *         description: Errore nell'aggiornamento dell'utente
 */
router.put('/api/utenti/:id', (req, res) => {
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
 *       500:
 *         description: Errore nell'eliminazione dell'utente
 */
router.delete('/api/utenti/:id', (req, res) => {
  const userId = req.params.id;

  // Prima elimina tutti i post associati
  connection.query('DELETE FROM post WHERE utente_id = ?', [userId], (err) => {
      if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione dei post' });

      // Poi elimina l'utente
      connection.query('DELETE FROM utenti WHERE id = ?', [userId], (err) => {
          if (err) return res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
          res.status(204).send();
      });
  });
});


/**
 * @swagger
 * /api/utenti/ruolo/{ruolo}:
 *   get:
 *     summary: Recupera gli utenti di un ruolo specifico
 *     tags: [Utenti]
 *     parameters:
 *       - name: ruolo
 *         in: query
 *         required: true
 *         description: Ruolo dell'utente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utenti trovati
 *       404:
 *         description: Utenti non trovati
 *       500:
 *         description: Errore del server
 */
router.get('/api/utenti/ruolo/:ruolo', (req, res) => {
    const ruolo = req.query.ruolo;
    
    if (!ruolo) {
       return res.status(400).json({ error: 'Parametro ruolo mancante' });
    }
 
    connection.query('SELECT * FROM utenti WHERE ruolo = ?', [ruolo], (err, results) => {
       if (err) return res.status(500).json({ error: 'Errore nel recupero degli utenti' });
       if (results.length === 0) return res.status(404).json({ error: 'Utenti non trovati' });
       res.status(200).json(results);
    });
 });



/**
 * @swagger
 * /api/utenti/username/{id}:
 *   patch:
 *     summary: Aggiorna lo username di un utente specifico
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
 *               username:
 *                 type: string
 *     responses:
 *       204:
 *         description: Username aggiornato con successo
 */
router.patch('/api/utenti/username/:id', (req, res) => {
    const { username } = req.body;
    const userId = req.params.id;

    if (!username) {
        return res.status(400).json({ error: 'Username non fornito' });
    }
    
    connection.query('UPDATE utenti SET username = ? WHERE id = ?', [username, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Errore nell\'aggiornamento dello username' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        res.status(204).send(); 
    });
});

/**
 * @swagger
 * /api/utenti/profilo/{id}:
 *   get:
 *     summary: Recupera il profilo di un utente con i suoi post giornalieri
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
 *         description: Profilo utente con post giornalieri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utente:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     data_registrazione:
 *                       type: string
 *                       format: date-time
 *                 post_giornalieri:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       titolo:
 *                         type: string
 *                       contenuto:
 *                         type: string
 *                       data_creazione:
 *                         type: string
 *                         format: date-time
 *                       luogo:
 *                         type: string
 *                       posizione_geografica:
 *                         type: object
 *                         properties:
 *                          lat:
 *                            type: number
 *                          lng:
 *                            type: number
 */
router.get('/api/utenti/profilo/:id', (req, res) => {
    const userId = req.params.id;

    connection.query('SELECT * FROM utenti WHERE id = ?', [userId], (err, utenteResults) => {
        if (err) return res.status(500).json({ error: 'Errore nel recupero del profilo utente' });
        if (utenteResults.length === 0) return res.status(404).json({ error: 'Utente non trovato' });
        
        const utente = utenteResults[0];

        const oggi = new Date().toISOString().split('T')[0]; 
        connection.query(
            'SELECT * FROM post WHERE utente_id = ? AND DATE(data_creazione) = ?',
            [userId, oggi],
            (err, postResults) => {
                if (err) return res.status(500).json({ error: 'Errore nel recupero dei post giornalieri' });

                res.json({
                    utente: {
                        id: utente.id,
                        nome: utente.nome,
                        username: utente.username,
                        email: utente.email,
                        data_registrazione: utente.data_registrazione,
                    },
                    post_giornalieri: postResults
                });
            }
        );
    });
});


module.exports = router;