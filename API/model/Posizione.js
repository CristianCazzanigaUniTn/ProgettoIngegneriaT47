const mongoose = require('mongoose');


const posizioneSchema = new mongoose.Schema({
  latitudine: {
    type: Number,
    required: true,
  },
  longitudine: {
    type: Number,
    required: true,
  },
});


module.exports = mongoose.model('Posizione', posizioneSchema);