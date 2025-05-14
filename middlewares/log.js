const chalk = require('chalk');

module.exports = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode < 400 ? chalk.green : chalk.red;

        console.log(
            `${chalk.gray(`[${new Date().toISOString()}]`)} ${chalk.blue(req.method)} ${chalk.yellow(req.originalUrl)} ${statusColor(res.statusCode)} - ${chalk.magenta(`${duration}ms`)}`
        );
    });

    next();
};
