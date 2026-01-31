const { ARGS } = require('../constants');

function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};

    Object.values(ARGS).forEach(arg => {
        const key = arg.replace(/^--/, '');
        parsed[key] = args.includes(arg);
    });

    return parsed;
}

module.exports = { parseArgs };
