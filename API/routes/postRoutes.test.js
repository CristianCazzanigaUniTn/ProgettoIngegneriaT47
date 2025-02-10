const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');

describe('GET /api/commenti/post/:id', () => {
    let postSpyFindById;
    let commentoSpyFind;
    let connection;

    beforeAll(async () => {
        const Post = require('../model/Post');
        const Commento = require('../model/Commento');

        jest.setTimeout(8000);
        connection = await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected for testing!');

        postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
            if (id === 'correctPostId') {
                return Promise.resolve({ _id: 'correctPostId', nome: 'Dummy Post' });
            } else {
                return Promise.resolve(null);
            }
        });

        commentoSpyFind = jest.spyOn(Commento, 'find').mockImplementation((criteria) => {
            if (criteria.post_id === 'correctPostId') {
                return Promise.resolve([{
                    _id: 'commentId1',
                    commento: 'Questo è un commento di test',
                    utente_id: 'userId1',
                    post_id: 'correctPostId',
                    data_creazione: new Date()
                }]);
            } else {
                return Promise.resolve([]);
            }
        });
    });

    afterAll(async () => {
        postSpyFindById.mockRestore();
        commentoSpyFind.mockRestore();
        await mongoose.connection.close();
        console.log('Database connection closed after tests');
    });

    test('Id giusto, dovrebbe restituire 200 e commenti', async () => {
        const res = await request(app)
            .get('/api/commenti/post/correctPostId')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('commento', 'Questo è un commento di test');

        expect(postSpyFindById).toHaveBeenCalledWith('correctPostId');
        expect(commentoSpyFind).toHaveBeenCalledWith({ post_id: 'correctPostId' });
    });

    test('Id sbagliato, dovrebbe restituire 404', async () => {
        const res = await request(app)
            .get('/api/commenti/post/incorrectPostId')
            .expect(404)
            .expect('Content-Type', /json/);

        expect(res.body).toHaveProperty('error', 'Post non trovato');
        expect(postSpyFindById).toHaveBeenCalledWith('incorrectPostId');
    });
});
