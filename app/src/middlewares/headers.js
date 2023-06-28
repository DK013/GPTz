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
            'default-src': ["'self'", `https://${redirectHost}`],
            styleSrc: ["'self'", "*"],
            scriptSrc: ["'self'", `https://${redirectHost}`, 'https://appssdk.zoom.us', 'https://cdn.jsdelivr.net'],
            imgSrc: ["'self'", `https://${redirectHost}`],
            'connect-src': ["'self'", `https://${redirectHost}`, 'https://api.zoom.us'],
            'base-uri': 'self',
            'form-action': 'self',
        },
    },
};

module.exports = headers;
