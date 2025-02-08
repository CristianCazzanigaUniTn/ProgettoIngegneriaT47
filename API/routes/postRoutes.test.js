const request = require('supertest');
const app = require('../index'); // Assicurati che il percorso sia corretto
const mongoose = require('mongoose');

describe('API /api/Post', () => {
    let connection;

    beforeAll(async () => {
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected!');
    });

    afterAll(() => {
        mongoose.connection.close(true);
        console.log('Database connection closed');
    });

    describe('GET /api/Post', () => {
        it('dovrebbe restituire tutti i post', async () => {
            const res = await request(app).get('/api/Post');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('posts');
            expect(Array.isArray(res.body.posts)).toBe(true);
        });
    });

    describe('GET /api/Post/:id', () => {
        it('dovrebbe restituire un post specifico', async () => {
            const postId = '65d1234567890abcdef12345'; // Usa un ID valido del database
            const res = await request(app).get(`/api/Post/${postId}`);

            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('success', true);
                expect(res.body).toHaveProperty('post');
            } else {
                expect(res.statusCode).toBe(404);
            }
        });
    });

    describe('POST /api/Post/luogo', () => {
        it('dovrebbe restituire i post vicini alla posizione specificata', async () => {
            const location = {
                lat: 45.4642,
                lng: 9.1900
            };

            const res = await request(app).post('/api/Post/luogo').send(location);

            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('success', true);
                expect(Array.isArray(res.body.posts)).toBe(true);
            } else {
                expect(res.statusCode).toBe(404);
            }
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log('Database connection closed');
    });
});


