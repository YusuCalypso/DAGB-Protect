const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    guildID: String,
});

module.exports = model('Ticket', ticketSchema)