
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const router = express.Router();
const SECRET = process.env.SECRET;

/**
 * @swagger
 * /api/v1/authentications:
 *   post:
 *     summary: Autentica l'utente e restituisce un token
 *     description: Autentica un utente tramite username e password, quindi restituisce un token JWT.
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
 *         description: Autenticazione avvenuta con successo con token
 *       401:
 *         description: Autenticazione fallita
 *       500:
 *         description: Errore del server
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

module.exports = router;
