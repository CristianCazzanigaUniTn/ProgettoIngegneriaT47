const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('./index');
const mongoose = require('mongoose');

let server;  // Variabile per l'istanza del server

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 404', () => {
  return request(app)
    .get('/')
    .expect(404);
});

afterAll(async () => {
  await mongoose.connection.close();  // Chiudi la connessione al database
  console.log('Database connection closed');
});
