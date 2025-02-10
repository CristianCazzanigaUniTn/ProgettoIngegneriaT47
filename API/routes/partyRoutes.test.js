const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Assicurati che il percorso sia corretto

describe('GET /api/party e DELETE /api/party', () => {
    
    let validPartyId;
    const invalidPartyId = '123456789012345678901234';
    let ownerUser;
    let nonOwnerUser;
    let ownerToken;
    let nonOwnerToken;

    beforeAll(async () => {

        const Categoria = require('../model/Categoria'); 
        const Party = require('../model/Party');
        const User = require('../model/User'); 

        const categoria = new Categoria({ nome: 'Musica' });
        const savedCategoria = await categoria.save();
    
        // Crea utenti per il proprietario e uno per un utente non proprietario
        ownerUser = new User({
            nome: 'Owner User',
            email : `owner_${Date.now()}@example.com`,
            password: 'password123',
            ruolo: 'utente_base',
            verified: true,
            foto_profilo: 'https://example.com/foto.jpg',
            preferenze_notifiche: true,
            genere: 'Maschio',
            username: `owneruser_${Date.now()}`
        });

        nonOwnerUser = new User({
            nome: 'Non-Owner User',
            email : `nonowner_${Date.now()}@example.com`,
            password: 'password123',
            ruolo: 'utente_base',
            verified: true,
            foto_profilo: 'https://example.com/foto_non_owner.jpg',
            preferenze_notifiche: true,
            genere: 'Femminile',
            username: `nonowneruser_${Date.now()}`
        });

        await ownerUser.save();
        await nonOwnerUser.save();

        // Genera i token JWT per i due utenti usando il secret (assicurati che process.env.SECRET sia definito)
        const jwt = require('jsonwebtoken');
        ownerToken = jwt.sign(
            { _id: ownerUser._id, email: ownerUser.email },
            process.env.SECRET,
            { expiresIn: '1d' }
        );
        nonOwnerToken = jwt.sign(
            { _id: nonOwnerUser._id, email: nonOwnerUser.email },
            process.env.SECRET,
            { expiresIn: '1d' }
        );

        // Crea un party di test (che verrà usato dai test GET e DELETE "validi")
        const party = new Party({
            nome: 'Test',
            descrizione: 'Descrizione di test',
            data_inizio: new Date(),
            luogo: 'Luogo di test',
            posizione: {
                latitudine: 45.464664,
                longitudine: 9.188540
            },
            Categoria: savedCategoria._id, 
            Organizzatore: ownerUser._id,   
            foto: 'https://example.com/foto.jpg',
            numero_massimo_partecipanti: 100,
        });
    
        const savedParty = await party.save();
        validPartyId = savedParty._id.toString();
    });

    test('GET /api/party dovrebbe restituire tutti i party', async () => {
        const res = await request(app)
            .get('/api/party')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/party/:id (valido) dovrebbe restituire i dettagli del party con ID valido (200)', async () => {
        const res = await request(app)
            .get(`/api/party/${validPartyId}`)
            .expect(200)
            .expect('Content-Type', /json/);
        
        expect(res.body).toHaveProperty('nome');
        expect(res.body).toHaveProperty('descrizione');
        expect(res.body.nome).toBe('Test');
    });
    
    test('GET /api/party/:id (invalido) dovrebbe restituire 404 per ID inesistente', async () => {
        const res = await request(app)
            .get(`/api/party/${invalidPartyId}`)
            .expect(404)
            .expect('Content-Type', /json/);
    
        expect(res.body).toHaveProperty('error', 'Party non trovato');
    });
    
    test('DELETE /api/party/:id (valido) dovrebbe eliminare il party con ID valido', async () => {
        const res = await request(app)
            .delete(`/api/party/${validPartyId}`)
            .set('Authorization', `Bearer ${ownerToken}`) 
            .expect(200);
        expect(res.body).toHaveProperty('message', 'Party eliminato con successo');
    });

    test('DELETE /api/party/:id (invalido) dovrebbe restituire 404 per ID inesistente', async () => {
        const res = await request(app)
            .delete(`/api/party/${invalidPartyId}`)
            .set('Authorization', `Bearer ${ownerToken}`)
            .expect(404);
        expect(res.body).toHaveProperty('error', 'Party non trovato');
    });

    test('DELETE /api/party/:id dovrebbe restituire 403 se l\'utente non è il proprietario del party', async () => {
        const Party = require('../model/Party');
        const Categoria = require('../model/Categoria');
        const categoria = await Categoria.findOne() || new Categoria({ nome: 'Musica' });
        if (!categoria._id) await categoria.save();
        
        const newParty = new Party({
            nome: 'Test - Non owner',
            descrizione: 'Descrizione di test per non owner',
            data_inizio: new Date(),
            luogo: 'Luogo di test',
            posizione: {
                latitudine: 45.464664,
                longitudine: 9.188540
            },
            Categoria: categoria._id, 
            Organizzatore: ownerUser._id,   
            foto: 'https://example.com/foto.jpg',
            numero_massimo_partecipanti: 100,
        });
    
        const savedNewParty = await newParty.save();
        const newPartyId = savedNewParty._id.toString();

        const res = await request(app)
            .delete(`/api/party/${newPartyId}`)
            .set('Authorization', `Bearer ${nonOwnerToken}`)  
            .expect(403);
        expect(res.body).toHaveProperty('error', 'Non autorizzato a eliminare questo party');
    });
});
