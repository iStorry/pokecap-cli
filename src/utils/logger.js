const { createLogger, format, transports, addColors } = require('winston');

let alignColorsAndTime = format.combine(
    format.colorize({
        all: true
    }),
    format.label({
        label: "🚀"
    }),
    format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss"
    }),
    format.printf(
        info => `${info.label} ${info.timestamp} ${info.level} : ${info.message}`
    )
);

addColors({
    info: 'bold blue',
    warn: 'italic yellow',
    error: 'bold red',
    debug: 'bold green',
    pokemon: 'bold magenta',
    chat: 'bold cyan',
});

const level = {
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        pokemon: 4,
    }
    
}
    

module.exports = createLogger({
    levels: level.levels,
    transports: [
        new (transports.Console)({
            level: "pokemon",
            format: format.combine(format.colorize(), alignColorsAndTime),
        })
    ],
});


module.exports.pokemon = (logger, message) => {
    logger.log({'level': 'pokemon', 'message': message});
};