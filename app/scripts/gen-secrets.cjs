const envsub = require('envsub')
const crypto = require('crypto')
const fs = require('fs')

const {displayName} = require('../package.json')

const outputFile = '.env';
const templateFile = `${outputFile}.sample`;

const options = {
    protect: true,
    envs: [
        {
            name: '_SESSION_SECRET',
            value: crypto.randomBytes(32).toString('hex'),
        },
        {
            name: '_APP_NAME',
            value: displayName,
        },
    ],
};

if (!fs.existsSync(outputFile))
    envsub({ templateFile, outputFile, options }).catch((e) =>
        console.error(e)
    );
