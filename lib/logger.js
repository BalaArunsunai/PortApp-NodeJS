const { createLogger, format, transports } = require('winston');
const path = require('../config').server.path;
const options = {
    file: {
        level: 'info',
        filename: `${path}/logger/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = createLogger({
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message) {
        logger.info(message);
    },
};

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = { logger: logger };