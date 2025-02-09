const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

beforeAll(async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    await mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Database connected for testing!');
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log('Database connection closed after tests');
});

describe('GET /api/eventi', () => {
    let eventSpyFind;

    beforeAll(() => {
        const Event = require('../model/Evento');
        eventSpyFind = jest.spyOn(Event, 'find').mockImplementation(() => {
            return [{
                id: 1010,
                title: 'Test Event 1',
                date: '2025-02-10',
                location: 'Location 1'
            }];
        });
    });

    afterAll(() => {
        eventSpyFind.mockRestore();
    });

    test('dovrebbe restituire tutti gli eventi', async () => {
        const res = await request(app)
            .get('/api/eventi')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('title', 'Test Event 1');
        expect(eventSpyFind).toHaveBeenCalled();
    });
});

describe('GET /api/eventi/:id', () => {
    let eventSpyFindById;

    beforeAll(() => {
        const Event = require('../model/Evento');
        eventSpyFindById = jest.spyOn(Event, 'findById');
    });

    afterAll(() => {
        eventSpyFindById.mockRestore();
    });

    test('dovrebbe restituire l\'evento con status 200 se l\'id è corretto', async () => {
        const mockEvent = {
            _id: '65d8f5c9a40b3e28d0c7b5d1',
            id: 1010,
            title: 'Test Event 1',
            date: '2025-02-10',
            location: 'Location 1'
        };
        eventSpyFindById.mockResolvedValue(mockEvent);

        const res = await request(app)
            .get(`/api/eventi/${mockEvent._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toMatchObject({
            id: 1010,
            title: 'Test Event 1',
            date: '2025-02-10',
            location: 'Location 1'
        });
        expect(eventSpyFindById).toHaveBeenCalledWith(mockEvent._id);
    });

    test('dovrebbe restituire 404 se l\'id non esiste', async () => {
        const nonExistentId = '65d8f5c9a40b3e28d0c7b5d2'; 
        eventSpyFindById.mockResolvedValue(null);
    
        const res = await request(app)
            .get(`/api/eventi/${nonExistentId}`)
            .expect(404)
            .expect('Content-Type', /json/);
    
        expect(res.body).toHaveProperty('error', 'Evento non trovato'); 
        expect(eventSpyFindById).toHaveBeenCalledWith(nonExistentId);
    });
});