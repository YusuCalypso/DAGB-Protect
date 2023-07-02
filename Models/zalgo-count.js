const { Schema, model } = require('mongoose');

const AntiZalgoSchema1 = new Schema({
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

module.exports = model('anti-zalgo-count', AntiZalgoSchema1)