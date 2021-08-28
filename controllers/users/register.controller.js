// -----------------------------------------------------------------------------------------------//
// Archive: controllers/users/register.controller.js
// Description: File responsible for the 'register' function of the 'users' class controller
// Data: 2021/08/27
// Author: Allfcourse team
// -----------------------------------------------------------------------------------------------//

const query = require('@helpers/Query');
require('dotenv').config();

const emailrequest = require('@functions/sendConfirmationEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const checkregister = require('@functions/checkRegister');

exports.addUser = async (req, res) => {
    const errors = { criticalErrors: {}, validationErrors: {} };
    const { document } = req.body;
    const { email } = req.body;
    const { socialname } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    const { firstname } = req.body;
    const { lastname } = req.body;
    const { gender } = req.body;
    const { phone } = req.body;
    const { birthdate } = req.body;
    const token = crypto.randomBytes(20).toString('hex');
    const expire = new Date();
    expire.setHours(expire.getHours() + 2);
    try {
        // eslint-disable-next-line max-len
        const check = await checkregister.check(document, email, phone, firstname, lastname, gender, birthdate);
        if (check !== true) {
            res.sendError(check, 500);
        } else {
            const columns = {
                first_name: firstname,
                last_name: lastname,
                social_name: socialname || null,
                document,
                email,
                phone: parseInt(phone, 10),
                password,
                gender,
                birth_date: birthdate,
                type: 1,
                email_token: token,
                etoken_expire: expire,
            };
            const returningColumns = ['*'];
            const result = await query.Insert(
                'users',
                columns,
                returningColumns,
            );
            if (result.error.transaction !== false) {
                res.sendError({ message: result.error.transaction }, 500);
            } else {
                await emailrequest.send(email, firstname, token);
                res.status(201).send({ message: result.data });
            }
        }
    } catch (err) {
        errors.criticalErrors.errorCategory = {
            message: 'Ocorreu um erro inesperado.',
            code: 500,
            detail: { ...err },
        };
        res.sendError(errors, 500);
    }
};
