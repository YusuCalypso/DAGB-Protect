const { Schema, model } = require('mongoose');

const AntiScamSchema = new Schema({
    Guild: String,
    Channel: String
});

module.exports = model('anti-scam', AntiScamSchema)