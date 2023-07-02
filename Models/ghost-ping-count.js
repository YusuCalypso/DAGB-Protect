const { Schema, model } = require('mongoose');

const AntiGhostSchema1 = new Schema({
    Guild: String,
    Count: Number,
    Monday: Number,
    Tuesday: Number,
    Wednesday: Number,
    Thursday: Number,
    Friday: Number,
    Saturday: Number,
    Sunday: Number
});

module.exports = model('anti-ghost-ping-count', AntiGhostSchema1)