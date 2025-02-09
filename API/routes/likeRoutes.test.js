const request = require('supertest');
const app = require('../index'); // Assicurati che il percorso sia corretto
const mongoose = require('mongoose');

describe('GET /api/like/', () => {
    let postSpyFindById;
    let likeSpyFind;
    let connection;

    beforeAll(async () => {
        const Post = require('../model/Post');
        const Like = require('../model/Like');

        jest.setTimeout(8000);
        
        connection = await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected for testing!');

        postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
            if (id === 'validPostId') {
                return Promise.resolve({ _id: 'validPostId', nome: 'Dummy Post' });
            } else {
                return Promise.resolve(null);
            }
        });

  
        likeSpyFind = jest.spyOn(Like, 'find').mockImplementation((criteria) => {
            if (criteria.post_id === 'validPostId') {
                return Promise.resolve([{
                    _id: 'dummyLikeId',
                    utente_id: 'dummyUserId',
                    post_id: 'validPostId',
                    data_creazione: new Date()
                }]);
            } else {
                return Promise.resolve([]);
            }
        });
    });

    afterAll(async () => {
        postSpyFindById.mockRestore();
        likeSpyFind.mockRestore();
        await mongoose.connection.close();
        console.log('Database connection closed after tests');
    });

    test('Id giusto, 200: dovrebbe restituire tutti i like del post', async () => {
        const res = await request(app)
            .get('/api/like/post/validPostId')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('post_id', 'validPostId');

        expect(postSpyFindById).toHaveBeenCalledWith('validPostId');
        expect(likeSpyFind).toHaveBeenCalledWith({ post_id: 'validPostId' });
    });

    test('Id sbagliato, 404: dovrebbe restituire 404 se il post non è trovato', async () => {
        const res = await request(app)
            .get('/api/like/post/invalidPostId')
            .expect(404)
            .expect('Content-Type', /json/);

        expect(res.body).toHaveProperty('error', 'Post non trovato');
        expect(postSpyFindById).toHaveBeenCalledWith('invalidPostId');
    });
});
