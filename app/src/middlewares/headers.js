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
            'default-src': 'self',
            styleSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://appssdk.zoom.us/sdk.min.js'],
            imgSrc: ["'self'", `https://${redirectHost}`],
            'connect-src': 'self',
            'base-uri': 'self',
            'form-action': 'self',
        },
    },
};

module.exports = headers;
