process.env.TZ = 'America/Sao_Paulo';
require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cookie_parser = require('cookie-parser');

const app = express();
const router = express.Router();

const register = require('@controller/registerController');
const validateaccount = require('@controller/validAccountController');
const newemailtoken = require('@controller/newEmailTokenController');
const login = require('@controller/loginController');
const logout = require('@controller/logoutController');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookie_parser('1234'));

router.get('/test', (req, res) => {
    res.send('test');
});

router.post('/register', register.post);
router.post('/validate', validateaccount.post);
router.post('/newvalidate', newemailtoken.post);
router.post('/login', login.post);
router.post('/logout', logout.post);

module.exports = router;
