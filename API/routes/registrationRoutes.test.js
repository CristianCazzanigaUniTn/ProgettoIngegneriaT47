/**
 * File di esempio: registration.test.js
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');           
const User = require('../model/User');

describe('POST /api/Utenti (Registrazione) - con spy su User', () => {
  let connection;
  let spyFindOne;
  let spyCreate;

  // (Opzionale) Connessione al DB: 
  // Se vuoi mantenere la stessa struttura dell'esempio "like", puoi connetterti a un DB di prova
  beforeAll(async () => {
    jest.setTimeout(10000);

    // Connettiti a un database di test (o a quello reale se vuoi)
    connection = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected for testing!');
  });

  // Creiamo/rigeneriamo gli spy prima di ogni test,
  // così possiamo mockare comportamenti diversi test per test.
  beforeEach(() => {
    // Spia su findOne (lo useremo per controllare username o email già esistenti)
    spyFindOne = jest.spyOn(User, 'findOne');
    // Spia su create (per vedere come avviene la creazione)
    spyCreate = jest.spyOn(User, 'create');
  });

  // Ripristiniamo gli spy dopo ogni test.
  afterEach(() => {
    spyFindOne.mockRestore();
    spyCreate.mockRestore();
  });

  // (Opzionale) Chiudiamo la connessione al DB dopo tutti i test
  afterAll(async () => {
    await mongoose.connection.close();
    console.log('Database connection closed after tests');
  });

  test('Creazione corretta di un account con tutti i campi richiesti', async () => {
    // Mock: findOne deve restituire null (nessun utente con lo stesso username/email)
    spyFindOne.mockImplementation(async (criteria) => {
      return null; 
    });

    // Mock: create deve restituire il documento creato
    spyCreate.mockImplementation(async (newUserData) => {
      // Simuliamo che tutto vada a buon fine
      return {
        _id: 'mockedUserId',
        ...newUserData,
        createdAt: new Date()
      };
    });

    const newUser = {
      username: 'nuovoUtente',
      email: 'nuovo@example.com',
      password: 'password123',
      nome: 'Mario',
      genere: 'M',
      preferenze_notifiche: 'email',
      verified: false,
      foto_profilo: 'https://example.com/foto.jpg'
    };

    const response = await request(app)
      .post('/api/Utenti')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Utente creato con successo');

    // Controlliamo che i metodi spy siano stati chiamati correttamente
    expect(spyFindOne).toHaveBeenCalledTimes(1); // una chiamata per controllare esistenza username/email
    expect(spyCreate).toHaveBeenCalledTimes(1);  // una chiamata per creare effettivamente l'utente
  });


  test('Creazione di un account con username già esistente', async () => {
    // Mock: findOne deve restituire un oggetto che simula un utente esistente con quell'username
    spyFindOne.mockImplementation(async (criteria) => {
      if (criteria.username === 'utenteEsistente') {
        // Simula esistenza utente con quell'username
        return { 
          _id: 'someUserId', 
          username: 'utenteEsistente', 
          email: 'old@example.com' 
        };
      }
      return null;
    });

    // Per questa casistica, create non viene neanche chiamato (di solito).
    // Ma se venisse chiamato, potresti aggiungere un mockImplementation di default.
    spyCreate.mockImplementation(async (newUserData) => {
      return { _id: 'mockedUserId', ...newUserData };
    });

    const response = await request(app)
      .post('/api/Utenti')
      .send({
        username: 'utenteEsistente',
        email: 'nuovo2@example.com',
        password: 'password123',
        nome: 'Nuovo User',
        genere: 'M',
        preferenze_notifiche: 'email',
        foto_profilo: 'https://example.com/foto.jpg'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Registrazione fallita, username già esistente');

    // Verifica chiamate alle funzioni del modello
    expect(spyFindOne).toHaveBeenCalled(); // è stato chiamato con { username: 'utenteEsistente' } o simili
    expect(spyCreate).not.toHaveBeenCalled(); 
  });


  test('Creazione di un account con email già esistente', async () => {
    // Mock: findOne deve restituire un oggetto che simula un utente esistente con quell'email
    spyFindOne.mockImplementation(async (criteria) => {
      if (criteria.email === 'emailusata@example.com') {
        return { 
          _id: 'someUserId', 
          username: 'utenteEmail', 
          email: 'emailusata@example.com' 
        };
      }
      return null;
    });

    spyCreate.mockImplementation(async (newUserData) => {
      return { _id: 'mockedUserId', ...newUserData };
    });

    const response = await request(app)
      .post('/api/Utenti')
      .send({
        username: 'altroUtente',
        email: 'emailusata@example.com',
        password: 'password123',
        nome: 'Nuovo Email',
        genere: 'M',
        preferenze_notifiche: 'email',
        foto_profilo: 'https://example.com/foto.jpg'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Registrazione fallita, mail già esistente');

    expect(spyFindOne).toHaveBeenCalled();
    expect(spyCreate).not.toHaveBeenCalled();
  });


  test('Creazione di un account con email in formato non valido', async () => {
    // Simuliamo che `findOne` non trovi utenti. Non è un problema di duplicati, ma di validazione.
    spyFindOne.mockImplementation(async () => null);

    // Possiamo far sì che `create` lanci un errore di validazione
    spyCreate.mockImplementation(async (newUserData) => {
      // Se la mail è palesemente sbagliata, simuliamo un errore
      if (!newUserData.email.includes('@')) {
        const error = new Error('Formato email non valido');
        error.name = 'ValidationError';
        throw error;
      }
      return { _id: 'mockedUserId', ...newUserData };
    });

    const response = await request(app)
      .post('/api/Utenti')
      .send({
        username: 'utenteFormatoMail',
        email: 'questononèunemailvalida',
        password: 'password123',
        nome: 'NoMailFormat',
        genere: 'M',
        preferenze_notifiche: 'email',
        foto_profilo: 'https://example.com/foto.jpg'
      });

    // Visto che può variare la gestione (400 o 500),
    // verifichiamo solo che sia un codice di errore
    expect([400, 500]).toContain(response.status);
    expect(response.body).toHaveProperty('message'); 
    // es: "Formato email non valido"

    expect(spyFindOne).toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalled();
  });


  test('Creazione di un account omettendo un campo obbligatorio (es. password)', async () => {
    // Nessun utente duplicato
    spyFindOne.mockImplementation(async () => null);

    // create lancia un errore perché manca la password
    spyCreate.mockImplementation(async (newUserData) => {
      if (!newUserData.password) {
        const error = new Error('campi mancanti');
        error.name = 'ValidationError';
        throw error;
      }
      return { _id: 'mockedUserId', ...newUserData };
    });

    const response = await request(app)
      .post('/api/Utenti')
      .send({
        username: 'nuovoSenzaPassword',
        email: 'nuovosenzapwd@example.com',
        nome: 'Nome',
        genere: 'M',
        preferenze_notifiche: 'email',
        foto_profilo: 'https://example.com/foto.jpg'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'campi mancanti');

    expect(spyFindOne).toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalled();
  });
});
