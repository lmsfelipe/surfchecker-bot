const express = require('express');
const indexController = require('../controllers/index');

const router = express();

router.post('/users', indexController.createUser);
router.get('/users', indexController.getUsers);

module.exports = router;