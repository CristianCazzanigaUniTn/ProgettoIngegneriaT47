const request = require('supertest');
const app = require('../index'); 
const mongoose = require('mongoose');

describe('GET /api/Utenti/ e POST /api/Utenti/', () => {
  let userSpyFindById;
  let connection;

  beforeAll(async () => {
    const User = require('../model/User');
    jest.setTimeout(8000);
    
    connection = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected for testing!");


    userSpyFindById = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id === 'validUserId') {
        return {
          exec: () =>
            Promise.resolve({
              _id: 'validUserId',
              username: 'dummyuser',
              email: 'dummy@example.com',
              genere: 'Maschio',
              data_registrazione: new Date('2025-01-01'),
              preferenze_notifiche: 'true',
              ruolo: 'utente_base',
              foto_profilo: 'https://example.com/dummy.jpg',
              verified: true,
            }),
        };
      } else {
        return {
          exec: () => Promise.resolve(null),
        };
      }
    });
  });

  afterAll(async () => {
    userSpyFindById.mockRestore();
    await mongoose.connection.close();
    console.log("Database connection closed after tests");
  });

  test('Id giusto, 200: dovrebbe restituire le informazioni dell\'utente', async () => {
    const res = await request(app)
      .get('/api/Utenti/validUserId')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id', 'validUserId');
    expect(res.body.user).toHaveProperty('username', 'dummyuser');
  });


  test('Id sbagliato, 404: dovrebbe restituire "User not found"', async () => {
    const res = await request(app)
      .get('/api/Utenti/invalidUserId')
      .expect(404)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User not found');
  });



    
});
