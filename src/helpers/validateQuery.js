const { query } = require('express-validator');

const codeMin = 32;
const codeMax = 64;

const validateQuery = [
    query('code')
        .isString()
        .withMessage('code must be a string')
        .isLength({ min: codeMin, max: codeMax })
        .withMessage(`code must be > ${codeMin} and < ${codeMax} chars`)
        .escape(),
    query('state')
        .isString()
        .withMessage('state must be a string')
        .custom((value, { req }) => value === req.query.state)
        .withMessage('invalid state parameter')
        .escape(),
];

module.exports = validateQuery;