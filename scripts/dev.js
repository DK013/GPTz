const concurrently = require('concurrently');

// Configure our server environment variables for darwin/linux and win32
let command = `nodemon src/index.js`;

if (process.platform === 'win32')
    command = `set "DEBUG=gptz*" & ${command}`;
else command = `DEBUG="gptz*" ${command}`;

const { result } = concurrently([
    {
        command,
        name: 'dev-server',
        prefixColor: 'inverse.cyan',
    },
    {
        command: `rollup -c --watch`,
        name: 'dev-app',
        prefixColor: 'inverse.yellow',
    },
]);

result.catch((e) => console.error(e));
