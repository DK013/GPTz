require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const debug = require('debug');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const headers = require('./middlewares/headers');
const logFunc = require('./helpers/requestHelper');

const { appName, port, zoomApp } = require('./config');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const dbg = debug(`${appName}:app`);

app.use(helmet(headers));

app.use(express.json());
app.use(bodyParser.json(), cors());
app.options('*', cors());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set('port', port);
app.set('trust proxy', true);

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'html');

//logs
app.use(logger('dev', { stream: { write: (msg) => dbg(msg) } }));
axios.interceptors.request.use(logFunc);
axios.interceptors.response.use(logFunc);

//log request
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/api/v1', apiRoutes);

//handle error
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const title = `Error ${err.status}`;

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (res.locals.error) dbg(`${title} %s`, err.stack);

    res.status(status).render('error', {
        title: appName
    });
});

//handle 404
app.get('*', (req, res) => res.redirect('/'));

//start app
app.listen(port, () => {
    console.log(`app listenning on port ${port}`);
});

module.exports = app;