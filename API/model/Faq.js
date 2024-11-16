var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    }
});

const Category = mongoose.model('Categorie', CategorySchema, 'Categorie');

module.exports = Category;
