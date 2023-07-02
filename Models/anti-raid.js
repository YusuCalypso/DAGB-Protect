const { Schema, model } = require('mongoose');

const AntiRaidSchema = new Schema({
    Guild: String,
    Channel: String,
    MemberBan: String,
    MemberKick: String,
    MemberNickNameUpdate: String,
    MemberRoleUpdate: String,
    RoleCreate: String,
    RoleDelete: String,
    ChannelCreate: String,
    ChannelDelete: String,
    NewAccounts: String,
    KickNewAccounts: String,
    BanNewAccounts: String,
    WebhookID: String,
    WebhookToken: String
});

module.exports = model('anti-raid-setups', AntiRaidSchema)