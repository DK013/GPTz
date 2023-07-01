const url = require('node:url');
const { redirectUri } = require('../config.js');
const redirectHost = url.parse(redirectUri).host;

const headers = {
    frameguard: {
        action: 'sameorigin',
    },
    hsts: {
        maxAge: 31536000,
    },
    referrerPolicy: 'same-origin',
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            'default-src': ["'self'", `https://${redirectHost}`, 'https://source.zoom.us'],
            styleSrc: ["'self'", "*", "'unsafe-inline'"],
            scriptSrc: ["'self'", "*", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
            imgSrc: ["'self'", `https://${redirectHost}`],
            'connect-src': ["'self'", "*"],
            'base-uri': 'self',
            'form-action': 'self',
        },
    },
};

module.exports = headers;
