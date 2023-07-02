const { Schema, model } = require('mongoose');

const VerificationSchema = new Schema({
    User: String,
    Guild: String,
    Username: String,
    Guild: String,
    Code: String
});

module.exports = model('Verification-code', VerificationSchema)