const { createLogger, format, transports, addColors } = require('winston');

let alignColorsAndTime = format.combine(
    format.colorize({
        all:true
    }),
    format.label({
        label: '[PokeCap]'
    }),
    format.timestamp({
        format: "YY-MM-DD HH:MM:SS"
    }),
    format.printf(
        info => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
    )
);

addColors({
    info: 'bold blue',
    warn: 'italic yellow',
    error: 'bold red',
    debug: 'bold green'
});

    

module.exports  = createLogger({
    level: "debug",
    transports: [
        new (transports.Console)({
            format: format.combine(format.colorize(), alignColorsAndTime)
        })
    ],
});
