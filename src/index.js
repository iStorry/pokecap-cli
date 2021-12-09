const axios = require('axios');
const logger = require('./utils/logger');
const api = require('./utils/api');
const tmi = require('tmi.js');

logger.info(`Starting Application`);

(async() => {
    const user = process.argv[2];
    const channel = process.argv[3];
    const token = process.argv[4];

    if (!user || !channel || !token)
        return logger.error(`Failed to start application. Please provide a valid arguments.`);

    // Check if the target user is a valid Twitch user.
    const users = await api.request(api.users(`${user}&login=${channel}`), token);

    if (users.data.length === 0)
        return logger.error(`No user found with the given name.`);
    
    if (users.data.length < 2)
        return logger.error(`Please check your username and channel name.`);
    
    // Check if the target user is live.
    const stream = await api.request(api.streams(channel), token);
    if (stream.data.length === 0)
        return logger.warn(`The user is not streaming. Please check again later.`);
        
    // Check if the current user is valid Twitch 

    const opts = {
        identity: {
            username: user,
            password: `oauth:${token}`
        },
        channels: [channel]
    };
    
    const client = new tmi.client(opts);
    client.connect();

    // Register our event handlers (defined below)
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    // Called every time a message comes in
    function onMessageHandler (target, context, msg, self) {
        if (self) { return; } // Ignore messages from the bot
        // Remove whitespace from chat message
        const re = new RegExp('(?<=TwitchLit A wild) (.*) (?=appears TwitchLit Catch it using !pokecatch)');
        const re2 = new RegExp('(?<=has been caught by:) (.*)');
        const pokematch = msg.match(re);
        if (pokematch) {
            logger.debug(`[${target}] - A wild ${pokematch[1]} appeared!`);
            sleep(Math.round(Math.random() * 10000)).then(() => {
                client.say(target, `!pokecatch`);
                logger.info(`[${target}] - message sent.`);
            });
        }

        const pokecaught = msg.match(re2);
        if (pokecaught) {
            if (pokecaught[1].match(user)) {
                logger.debug(`[${target}] - Pokemon Caught.`);
            } else {
                logger.error(`[${target}] - Pokemon Escaped.`);
            }
        }

        if (process.argv.find(x => x === "--chat")) {
            logger.info(`[${target}] - ${msg}`);
        }
    }

    // Called every time the bot connects to Twitch chat
    function onConnectedHandler (addr, port) {
        logger.info(`Connected to ${addr}`);
    }

})();
