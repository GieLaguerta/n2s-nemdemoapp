const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    password: String,
    wallet_address: String,
    publicKey: String,
    privateKey: String,
    txHash: String
}, { _id: false});

userSchema.plugin(AutoIncrement);

const User = mongoose.model('User', userSchema);
module.exports = User;