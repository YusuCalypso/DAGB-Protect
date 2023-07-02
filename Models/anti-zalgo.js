const { Schema, model } = require('mongoose');

const AntiZalgoSchema = new Schema({
    Guild: String,
    Channel: String,
    Action: String,
    Time: String,
    IgnoredUser: Array,
    IgnoredRole: String
});

module.exports = model('anti-zalgo', AntiZalgoSchema)