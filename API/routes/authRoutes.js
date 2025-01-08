const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const SECRET = process.env.SECRET;

/**
 * @swagger
 * /api/v1/authentications:
 *   post:
 *     summary: Authenticate user and return a token
 *     description: Authenticates a user by username and password, then returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication success with token
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
router.post('/api/v1/authentications', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).exec();

        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                const token = jwt.sign({ _id: user._id, ruolo: user.ruolo}, SECRET, { expiresIn: '1h' });
                res.status(200).json({
                    success: true,
                    message: 'Authentication success',
                    token: token,
                    username: user.username,
                    id: user._id,
                    foto_profilo: user.foto_profilo,
                    ruolo: user.ruolo
                });
            } else {
                res.status(401).json({ success: false, message: 'Authentication failed' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err });
    }
});

/**
 * @swagger
 * /api/v1/authentications/google:
 *   post:
 *     summary: Authenticate user with Google token and return a token
 *     description: Authenticates a user by Google token, then returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication success with token
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
router.post('/api/v1/authentications/google', async (req, res) => {
    const { googleToken } = req.body;  // Ottieni il googleToken dal corpo della richiesta

    try {
        // Verifica il token con la funzione che hai scritto in loggedUser.ts
        const userData = await verifyGoogleToken(googleToken);

        // Controlla se l'utente esiste nel database
        let user = await User.findOne({ email: userData.email }).exec();

        if (!user) {
            // Se l'utente non esiste, puoi crearlo
            user = new User({
                username: userData.name,  // Usa il nome dell'utente da Google
                email: userData.email,    // Usa l'email dell'utente da Google
                foto_profilo: userData.picture || '',  // Usa l'immagine del profilo se disponibile
                ruolo: 'user'  // Imposta un ruolo di default
            });

            // Salva l'utente nel database
            await user.save();
        }

        // Crea un JWT per l'autenticazione
        const token = jwt.sign({ _id: user._id, ruolo: user.ruolo }, SECRET, { expiresIn: '1h' });

        // Restituisci il token e i dettagli dell'utente
        res.status(200).json({
            success: true,
            message: 'Authentication success',
            token: token,
            username: user.username,
            id: user._id,
            foto_profilo: user.foto_profilo,
            ruolo: user.ruolo
        });
        
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err });
    }
});



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Assicurati che sia corretto
    });
    const payload = ticket.getPayload();
    return payload; // Contiene le informazioni dell'utente (es. email, nome, ecc.)
}


module.exports = router;