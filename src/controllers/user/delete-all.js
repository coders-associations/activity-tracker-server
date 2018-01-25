const HttpStatus = require('http-status-codes');
const logger = require('../../lib/logger');

const { User} = require('../../models');

module.exports = (req, res, next) => {
    User.remove({})
        .exec()
        .then((result) => {
            res.sendStatus(HttpStatus.OK);
        })
        .catch((err) => {
            logger.error(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        });
};
