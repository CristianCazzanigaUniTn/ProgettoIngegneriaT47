
const express = require('express');
const User = require('../model/User');
const tokenChecker = require('../src/TokenChecker');
const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get user information
 *     description: Get user information using a valid JWT token.
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/api/v1/users', tokenChecker, async (req, res) => {
    try {
        console.log("Dati utente nel controller:", req.user);
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'Token not valid or missing' });
        }
        const user = await User.findOne({ _id: req.user._id }).exec();  
        if (user) {
            res.status(200).json({
                success: true,
                user: {
                    self: 'api/v1/users/' + user._id,
                    username: user.username,
                    email: user.email,
                    genere: user.genere,
                    data_registrazione: user.data_registrazione,
                    preferenze_notifiche: user.preferenze_notifiche,
                    ruolo: user.ruolo
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message || err });
    }
});


module.exports = router;
