
const colors = require('colors')
const fs = require('fs')
const fetch = require('cross-fetch')
const config = require('../config.js')

module.exports.log = (message, level) => {

    // If no level provided, default to info
    if (!level) return console.log(colors.blue.bold('[Info]') + ' > '.yellow + message)

    switch (level.toUpperCase()) {
        case 'ERROR':
            console.log(colors.red.bold('[Error]') + ' > '.yellow + message)
            break;

        case 'WARN':
            console.log(colors.yellow.bold('[Warning]') + ' > '.yellow + message)
            break;

        case 'INFO':
            console.log(colors.blue.bold('[Info]') + ' > '.yellow + message)
            break;

        default:
            log(`Invalid log level "${level}". Original message: ${message}`, 'ERROR')
            break;
    }
}

module.exports.createLogHook = async(channel, cb) => {

    let avatar = fs.readFileSync('./logo.png').toString('base64')

    channel.createWebhook({
            avatar: `data:image/png;base64,${avatar}`,
            name: `ScamAway`
        }, `ScamAway Log`)
        .then(hook => {
            cb(`https://discord.com/api/webhooks/${hook.id}/${hook.token}`)
        })
        .catch(err => { return })

}

module.exports.getSettings = async(guildId) => {
    return JSON.parse(await process.database.get(guildId))
}

module.exports.setSettings = (guildId, settings) => {
    process.database.put(guildId, JSON.stringify(settings))
}

module.exports.checkDomain = async(domain) => {
    let response = await fetch(config.api + `/check?domain=${domain}`, {
        method: 'GET',
        headers: {
            'X-Identity': config.identifier
        }
    })
    let body = await response.json()
    return body
}