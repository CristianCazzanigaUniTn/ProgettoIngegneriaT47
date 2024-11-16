var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
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

const Event = mongoose.model('Eventi', EventSchema, 'Eventi');

module.exports = Event;
