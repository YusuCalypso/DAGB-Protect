const { Schema, model } = require('mongoose');

const AntiToxicSchema = new Schema({
    Guild: String,
    Channel: String,
    IgnoredUser: Array,
    IgnoredRole: String
});

module.exports = model('anti-toxicity', AntiToxicSchema)