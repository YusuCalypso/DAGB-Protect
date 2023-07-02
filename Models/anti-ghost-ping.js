const { Schema, model } = require('mongoose');

const AntiGhostPingSchema = new Schema({
    Guild: String,
    Channel: String,
    IgnoredUser: Array,
    IgnoredRole: String
});

module.exports = model('anti-ghost-ping', AntiGhostPingSchema)