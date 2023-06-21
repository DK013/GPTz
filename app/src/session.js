const cookieSession = require('cookie-session');
const { zoomApp } = require('./config.js');

module.exports = cookieSession({
    name: 'session',
    httpOnly: true,
    keys: [zoomApp.sessionSecret],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
});