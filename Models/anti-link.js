const { Schema, model } = require('mongoose');

const AntiLinkSchema = new Schema({
    Guild: String,
    Channel: String,
    IgnoredUser: Array,
    IgnoredRole: String
});

module.exports = model('anti-link', AntiLinkSchema)