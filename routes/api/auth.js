const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const config = require('config');

const User = require('../../models/User');
// @rout GET :   api/auth
// @disc     :   Test route
// @access   :   Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.post('/',
    [
        check('email', 'Enter Valid Email.').isEmail(),
        check('password', 'Password required.').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {

            let user = await User.findOne({ email }); // returns the whole info of user according to User model from database based on the email id that is submitted.
            // console.log(user);
            if (!user) {
                return res.status(400).send({ error: [{ msg: 'Invalid Credentials!' }] });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    });

module.exports = router;