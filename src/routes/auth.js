const express = require('express');
const router = express.Router();

const session = require('../session');
const validateQuery = require('../helpers/validateQuery');

const { authController } = require('../controller/auth');

router.get('/', session, validateQuery, authController);

module.exports = router;