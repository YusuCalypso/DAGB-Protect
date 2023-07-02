const { Schema, model } = require('mongoose');

const WebhooksSchema = new Schema({
    Guild: String,
    WebhookID: String,
    WebhookToken: String
});

module.exports = model('webhooks', WebhooksSchema) 