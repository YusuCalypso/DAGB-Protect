const { Schema, model } = require('mongoose');

const VerificationSchema = new Schema({
    User: String,
    Code: String
});

module.exports = model('Verification-code-modal', VerificationSchema)