const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, WebhookClient, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const client = new Client({
  intents: 3276799,
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});
const mongoose = require("mongoose")
var crypto = require('crypto');
const VerificationModel = require("./Models/code")
const VerificationModel2 = require("./Models/verification")
const VerificationModelCode = require("./Models/modalcode")
var DB = require('./Models/anti-toxicity.js')
var DB1 = require('./Models/anti-zalgo.js')
var DB2 = require('./Models/zalgo-count.js')
var DB3 = require('./Models/anti-scam.js')
var DB4 = require('./Models/anti-scam-count.js')
const dotenv = require('dotenv')
require('dotenv').config()

mongoose.connect("YOUR_LINK_MONGODB")
  .then(function () {
    console.log('-----------------------------------------------------');
    console.log(`-= Mongoose connected. =-`);
    console.log('-----------------------------------------------------\n');
  })
  .catch(function (t) {
    console.log('-----------------------------------------------------');
    console.log(`-= Error! =-`);
    console.log(`${t}`);
    console.log('-----------------------------------------------------');
  })

const fetch = require("node-fetch")

client.on('ready', () => {
})

const Embed = new EmbedBuilder()
  .setColor(0xFF0000)
  .setTimestamp()

process.on("unhandledRejection", (reason, p) => {

  console.log(reason, p)

  const webhookClient = new WebhookClient({ id: "YOUR_WEBHOOK_ID", token: "RxFwvzKCKTWi0F_gAavAuwqxcmMSQ9XcD2AZ9cd8lq2MhpqyrZ3EOAWZXjp797MOIAdE" });
  webhookClient.send({
    username: 'AntiSystem Errors',
    embeds: [
      Embed
        .setDescription("**Unhandled Rejection/Catch:\n\n** ```" + reason + "```")
        .setTitle(`⚠ | Error Encountered`)
    ]
  });

})

process.on("uncaughtException", (err, origin) => {

  console.log(err, origin)
  const webhookClient2 = new WebhookClient({ id: "YOUR_WEBHOOK_ID", token: "RxFwvzKCKTWi0F_gAavAuwqxcmMSQ9XcD2AZ9cd8lq2MhpqyrZ3EOAWZXjp797MOIAdE" });
  webhookClient2.send({
    username: 'AntiSystem Errors',
    embeds: [
      Embed
        .setDescription("**Uncaught Exception/Catch:\n\n** ```" + err + "\n\n" + origin.toString() + "```")
        .setTitle(`⚠ | Error Encountered`)
    ]
  })


})

process.on("uncaughtExceptionMonitor", (err, origin) => {

  console.log(err, origin)

  const webhookClient2 = new WebhookClient({ id: "YOUR_WEBHOOK_ID", token: "RxFwvzKCKTWi0F_gAavAuwqxcmMSQ9XcD2AZ9cd8lq2MhpqyrZ3EOAWZXjp797MOIAdE" });
  webhookClient2.send({
    username: 'AntiSystem Errors',
    embeds: [
      Embed
        .setDescription("**Uncaught Exception/Catch (MONITOR):\n\n** ```" + err + "\n\n" + origin.toString() + "```")
        .setTitle(`⚠ | Error Encountered`)
    ]
  })

})

const fs = require('fs');
const config = require('./config.json');

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();
client.prefix = config.prefix;

module.exports = client;

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;


////////////////////////////// CRON JOB////////////////////////////////////////
const cron = require('node-cron');

cron.schedule('0 0 * * 1', async function () {
  console.log('---------------------');
  console.log('Running Cron Job - Weekly update');
  await DB2.updateMany({ $set: { Monday: 0 } })
  await DB2.updateMany({ $set: { Tuesday: 0 } })
  await DB2.updateMany({ $set: { Wednesday: 0 } })
  await DB2.updateMany({ $set: { Thursday: 0 } })
  await DB2.updateMany({ $set: { Friday: 0 } })
  await DB2.updateMany({ $set: { Saturday: 0 } })
  await DB2.updateMany({ $set: { Sunday: 0 } })
  await DB4.updateMany({ $set: { Monday: 0 } })
  await DB4.updateMany({ $set: { Tuesday: 0 } })
  await DB4.updateMany({ $set: { Wednesday: 0 } })
  await DB4.updateMany({ $set: { Thursday: 0 } })
  await DB4.updateMany({ $set: { Friday: 0 } })
  await DB4.updateMany({ $set: { Saturday: 0 } })
  await DB4.updateMany({ $set: { Sunday: 0 } })

});

//////////////////////////////////////////////////////////////////////
fs.readdirSync('./handlers').forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});


client.login(process.env.TOKEN)
