const express = require('express');
const router = express.Router();
const {createGoogleLogin} = require('../controller/googleSignInController');

router.post('/', createGoogleLogin)


module.exports = router;