require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const apiRoutes = require('./routes');

app.use(express.json());
app.use(bodyParser.json(), cors());
app.options('*', cors());

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'html');

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'GPTz'
    });
})

app.use('/api/v1', apiRoutes);

app.listen(process.env.PORT, () => {
    console.log(`listenning on port ${process.env.PORT}`);
});