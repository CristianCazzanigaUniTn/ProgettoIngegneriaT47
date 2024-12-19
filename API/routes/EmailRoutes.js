const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Configura SendGrid
sgMail.setApiKey(process.env.EMAIL_API_KEY);

/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Invia un'email ad un utente base
 *     tags: [EmailService]
 *     description: Questo endpoint consente di inviare un'email agli utenti.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Indirizzo email del destinatario
 *               subject:
 *                 type: string
 *                 description: Oggetto dell'email
 *               text:
 *                 type: string
 *                 description: Contenuto testuale dell'email
 *               html:
 *                 type: string
 *                 description: Contenuto HTML dell'email
 *     responses:
 *       200:
 *         description: Email inviata con successo
 *     security:
 *       - bearerAuth: []
 */
router.post('/send-email', async (req, res) => {
    const { to, subject, text, html } = req.body;

    const msg = {
        to,
        from: 'pietrocalvi04@gmail.com',
        subject,
        text,
        html,
    };

    try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email inviata con successo!' });
} catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error.response ? error.response.body : error);
    res.status(500).json({ error: 'Errore durante l\'invio dell\'email.' });
}

});

module.exports = router;