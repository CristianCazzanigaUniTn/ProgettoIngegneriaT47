var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true, 
    },
    password: {
        type: String,
        required: true, 
    },
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+@.+\..+/
    },
    genere: {
        type: String,
        enum: ['Male', 'Female', 'Genderqueer', 'Bigender'], 
        required: true,
    },
    data_registrazione: {
        type: Date,
        default: Date.now, 
    },
    preferenze_notifiche: {
        type: String,
        enum: ['email', 'sms', 'none', 'email_sms'], 
        required: true,
    },
    ruolo: {
        type: String,
        enum: ['utente_base', 'organizzatore', 'amministratore'], 
        required: true,
    }
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.comparePassword = function(password) {
    return password==this.password;
    // return bcrypt.compare(password, this.password); 
};

const User = mongoose.model('User', UserSchema, 'User');  

module.exports = User;
