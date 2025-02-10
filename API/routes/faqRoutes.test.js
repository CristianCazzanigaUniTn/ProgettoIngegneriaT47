/**
 * faqRoutes.test.js
 */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../index');

// Import models (so we can spy on them)
const User = require('../model/User');
const Event = require('../model/Evento');
const Faq = require('../model/Faq');

// Make sure we use the same secret as tokenChecker
process.env.SECRET = '9f1a8c8e9b59f2bb9b91724a934d6edab9a8d9c57bdc743fcd2dd2ec6c0a67e4';

describe('POST /api/faqeventi', () => {
  let eventFindByIdSpy;
  let faqCreateSpy;
  let tokenValidoUtenteBase;
  let tokenValidoUtenteNonBase;

  beforeAll(async () => {
    // ─────────────────────────────────────────────────────────────────
    // 1) MOCK MONGOOSE CALLS
    // ─────────────────────────────────────────────────────────────────
    eventFindByIdSpy = jest.spyOn(Event, 'findById').mockImplementation((id) => {
      // Return a simulated Event doc if ID is "validEventId"
      if (id === 'validEventId') {
        return Promise.resolve({ _id: 'validEventId', nome: 'Evento di Test' });
      }
      return Promise.resolve(null);
    });

    faqCreateSpy = jest.spyOn(Faq, 'create').mockImplementation((faqData) => {
      // Return a simulated newly created FAQ
      return Promise.resolve({
        _id: 'createdFaqId',
        evento: faqData.id_evento,
        domanda: faqData.domanda,
        risposta: faqData.risposta || '',
      });
    });

    // ─────────────────────────────────────────────────────────────────
    // 2) GENERATE TOKENS WITH THE SAME SECRET
    //    your tokenChecker uses `process.env.SECRET`
    // ─────────────────────────────────────────────────────────────────
    tokenValidoUtenteBase = jwt.sign(
      { _id: 'utenteBaseId', ruolo: 'utente_base' },
      process.env.SECRET, // Note the change here
      { expiresIn: '1h' }
    );

    tokenValidoUtenteNonBase = jwt.sign(
      { _id: 'utenteNonBaseId', ruolo: 'admin' },
      process.env.SECRET, // Note the change here
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Restore the original implementation
    eventFindByIdSpy.mockRestore();
    faqCreateSpy.mockRestore();
    // If you connected to a DB in your test, close it:
    // await mongoose.connection.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('Creazione FAQ con ID evento corretto e token valido => 201', async () => {
    const res = await request(app)
      .post('/api/faqeventi')
      .set('Authorization', `Bearer ${tokenValidoUtenteBase}`)
      .send({
        id_evento: 'validEventId',
        domanda: 'Domanda di test',
      });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('_id', 'createdFaqId');
    expect(res.body.evento).toEqual('validEventId');
    expect(res.body.domanda).toEqual('Domanda di test');

    // Check spy calls
    expect(eventFindByIdSpy).toHaveBeenCalledWith('validEventId');
    expect(faqCreateSpy).toHaveBeenCalledWith({
      id_evento: 'validEventId',
      domanda: 'Domanda di test',
      risposta: '',
      utente: expect.any(String), // if your controller adds the 'utente' field from token
    });
  });

  test('Creazione FAQ senza id_evento => 400 (ID evento non valido)', async () => {
    const res = await request(app)
      .post('/api/faqeventi')
      .set('Authorization', `Bearer ${tokenValidoUtenteBase}`)
      .send({
        // Missing id_evento
        domanda: 'Domanda senza ID',
      });

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error', 'ID evento non valido');

    // Shouldn't call findById or create
    expect(eventFindByIdSpy).not.toHaveBeenCalled();
    expect(faqCreateSpy).not.toHaveBeenCalled();
  });

  test('Creazione FAQ con ID non valido => 400 (ID evento non valido)', async () => {
    const res = await request(app)
      .post('/api/faqeventi')
      .set('Authorization', `Bearer ${tokenValidoUtenteBase}`)
      .send({
        id_evento: '1234abc', // Not a valid Mongo ObjectId
        domanda: 'Domanda con ID non valido',
      });

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error', 'ID evento non valido');

    expect(eventFindByIdSpy).not.toHaveBeenCalled();
    expect(faqCreateSpy).not.toHaveBeenCalled();
  });

  test('Creazione FAQ con ID evento inesistente => 400 (Evento non trovato)', async () => {
    const res = await request(app)
      .post('/api/faqeventi')
      .set('Authorization', `Bearer ${tokenValidoUtenteBase}`)
      .send({
        id_evento: 'unexistingEventId',
        domanda: 'Domanda con evento inesistente',
      });

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('error', 'ID evento non valido');

    expect(eventFindByIdSpy).toHaveBeenCalledWith('unexistingEventId');
    expect(faqCreateSpy).not.toHaveBeenCalled();
  });

  test('Creazione FAQ con token mancante => 401 (No token provided)', async () => {
    const res = await request(app)
      .post('/api/faqeventi')
      // No Authorization header
      .send({
        id_evento: 'validEventId',
        domanda: 'Domanda con token assente',
      });

    // Because your tokenChecker returns 401 if no token
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty('message', 'No token provided');

    // Not even calling Mongoose
    expect(eventFindByIdSpy).not.toHaveBeenCalled();
    expect(faqCreateSpy).not.toHaveBeenCalled();
  });

  test('Creazione FAQ con token di utente non base => 403 (Non autorizzato) [if your code returns 403]', async () => {
    const res = await request(app)
      .post('/api/faqeventi')
      .set('Authorization', `Bearer ${tokenValidoUtenteNonBase}`)
      .send({
        id_evento: 'validEventId',
        domanda: 'Domanda con token di utente non base',
      });

    // If your route specifically checks ruolo !== 'utente_base' => 403
    // But if your code returns 401, adjust accordingly:
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty('error', 'Non autorizzato a creare una faq eventi');

    expect(eventFindByIdSpy).not.toHaveBeenCalled();
    expect(faqCreateSpy).not.toHaveBeenCalled();
  });
});
