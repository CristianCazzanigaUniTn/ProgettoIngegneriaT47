var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartySchema = new Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    descrizione: {
        type: String,
        required: true,
        trim: true,
    },
    data_inizio: {
        type: Date,
        default: Date.now,
    },
    luogo: {
        type: String,
        required: true,
    },
    posizione: {
        latitudine: {
            type: Number,
            required: true,
        },
        longitudine: {
            type: Number,
            required: true,
        }
    },
    numero_massimo_partecipanti: {
        type: Number,
        required: false,
    },
    foto: {
        type: String,
        required: false,
    },
    organizzatore: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    data_creazione: {
        type: Date,
        default: Date.now,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category', 
        required: true,
    }
});

const Party = mongoose.model('Party', PartySchema, 'Party');

module.exports = Party;
