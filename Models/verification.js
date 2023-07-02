const { Schema, model } = require('mongoose');

const VerificationSchema = new Schema({
    Guild: String,
    Channel: String,
    Type: String,
    Role: String
});

module.exports = model('Verification', VerificationSchema)