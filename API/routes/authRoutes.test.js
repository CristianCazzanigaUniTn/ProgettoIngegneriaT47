const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();  // Chiude eventuali connessioni aperte
    }

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Database connected for testing!');
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('Database connection closed after tests');
});


describe('POST /api/v1/authentications', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test('Accesso con credenziali corrette e account verificato', async () => {
        const user = new User({
            username: 'testuser',
            password: 'password123',
            nome: 'Test',
            email: 'test@example.com',
            genere: 'M',
            preferenze_notifiche: 'email',
            ruolo: 'user',
            foto_profilo: 'https://example.com/dummy.jpg',
            verified: true
        });
        await user.save();

        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ username: 'testuser', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty('token');
    });

    test('Accesso con credenziali corrette ma account non verificato', async () => { ///
        const user = new User({
            username: 'testuser',
            password: 'password123',
            nome: 'Test',
            email: 'test@example.com',
            genere: 'M',
            preferenze_notifiche: 'email',
            ruolo: 'user',
            foto_profilo: 'https://example.com/dummy.jpg',
            verified: false
        });
        await user.save();

        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ username: 'testuser', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('Accesso con credenziali errate', async () => {
        const user = new User({
            username: 'testuser',
            password: 'password123',
            nome: 'Test',
            email: 'test@example.com',
            genere: 'M',
            preferenze_notifiche: 'email',
            ruolo: 'user',
            foto_profilo: 'https://example.com/dummy.jpg',
            verified: true
        });
        await user.save();

        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ username: 'testuser', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('Accesso senza specificare lo username', async () => {
        const response = await request(app)
            .post('/api/v1/authentications')
            .send({ password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("Accesso ad un account senza specificare la password", async () => {
        const response = await request(app)
            .post("/api/v1/authentications")
            .send({
                email: "test@example.com",  
                password: ""              
            });
    
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Authentication failed");
        });
    
});
