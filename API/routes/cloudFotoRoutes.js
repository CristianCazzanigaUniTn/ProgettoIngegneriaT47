const express = require('express');
const router = express.Router();

const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

/**
 * @swagger
 * /generate-signed-url:
 *   post:
 *     summary: Genera un URL sicuro per il caricamento di immagini su Cloudinary
 *     tags: [CloudFoto]
 *     description: Questo endpoint fornisce un URL sicuro (con firma) che può essere utilizzato per caricare immagini su Cloudinary.
 *     responses:
 *       200:
 *         description: URL sicuro generato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signature:
 *                   type: string
 *                   description: La signature da usare per l'upload
 *                 timestamp:
 *                   type: integer
 *                   description: Il timestamp in secondi
 *                 upload_preset:
 *                   type: string
 *                   description: Il preset di upload configurato su Cloudinary
 */
router.post('/generate-signed-url', (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000); // Ottieni il timestamp in secondi
    
    // Definisci il preset di upload
    const uploadPreset = 'ml_default';  // Usa il nome del preset che hai creato su Cloudinary

    // Crea la "signature" per una richiesta sicura
    const signature = cloudinary.utils.api_sign_request({
        timestamp,
        uploadPreset
    }, process.env.API_SECRET);

    // Restituisci la signature, il timestamp e il preset di upload al frontend
    res.json({
        signature,
        timestamp,
        uploadPreset
    });
});

module.exports = router;