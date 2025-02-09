const request = require('supertest');
const app = require('../index'); // Adjust path to your app
const mongoose = require('mongoose');

describe('GET /api/commenti/', () => {
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

        // Spy on Post.findById to simulate finding a post
        postSpyFindById = jest.spyOn(Post, 'findById').mockImplementation((id) => {
            if (id === 'correctPostId') {
                // Return a promise resolving to a dummy post
                return Promise.resolve({ _id: 'correctPostId', title: 'Test Post' });
            } else {
                // Simulate post not found
                return Promise.resolve(null);
            }
        });

        // Spy on Commento.find to simulate finding comments for a given post
        commentoSpyFind = jest.spyOn(Commento, 'find').mockImplementation((criteria) => {
            if (criteria.post_id === 'correctPostId') {
                // Return a promise resolving to an array with one dummy comment
                return Promise.resolve([{
                    _id: 'commentId1',
                    commento: 'This is a test comment',
                    utente_id: 'userId1',
                    post_id: 'correctPostId',
                    data_creazione: new Date()
                }]);
            } else {
                // Return an empty array if no comments found
                return Promise.resolve([]);
            }
        });
    });

    afterAll(async () => {
        // Restore the original methods
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

        // Expect the response to be an array of comments
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('commento', 'This is a test comment');
        // Verify that the spies were called with the correct parameters
        expect(postSpyFindById).toHaveBeenCalledWith('correctPostId');
        expect(commentoSpyFind).toHaveBeenCalledWith({ post_id: 'correctPostId' });
    });

    test('Id sbagliato, dovrebbe restituire 404', async () => {
        const res = await request(app)
            .get('/api/commenti/post/incorrectPostId')
            .expect(404)
            .expect('Content-Type', /json/);

        // Expect the error message to be "Post non trovato"
        expect(res.body).toHaveProperty('error', 'Post non trovato');
        expect(postSpyFindById).toHaveBeenCalledWith('incorrectPostId');
    });
});
