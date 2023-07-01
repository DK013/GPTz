var env = process.env.NODE_ENV || 'development';
const url = require('node:url');
if(env === 'development')
    require('dotenv').config();

const config = process.env;
const deps = [
    'ZOOM_MEETING_SDK_KEY',
    'ZOOM_MEETING_SDK_SECRET',
    'ZOOM_REDIRECT_URL',
    'SESSION_SECRET',
    'OPENAI_KEY'
];

// Check that we have all our config dependencies
let hasMissing = !config;
for (const dep in deps) {
    const conf = deps[dep];
    const str = config[conf];

    if (!str || typeof str !== 'string') {
        console.error(`${conf} is required`);
        hasMissing = true;
    }
}

if (hasMissing) throw new Error('Missing required .env values...exiting');

try {
    url.parse(config.ZOOM_REDIRECT_URL);
} catch (e) {
    throw new Error(`Invalid ZOOM_REDIRECT_URL: ${e.message}`);
}

const zoomApp = {
    host: config.ZOOM_HOST || 'https://zoom.us',
    meetingKey: config.ZOOM_MEETING_SDK_KEY,
    meetingSecret: config.ZOOM_MEETING_SDK_SECRET,
    redirectUrl: config.ZOOM_REDIRECT_URL,
    sessionSecret: config.SESSION_SECRET,
    openaiKey: config.OPENAI_KEY
};

// Zoom App Info
const appName = config.APP_NAME || 'zoom-app';
const redirectUri = zoomApp.redirectUrl;

// HTTP
const port = config.PORT || '4000';

// require secrets are explicitly imported
module.exports = {
    zoomApp,
    appName,
    redirectUri,
    port,
};
