const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @rout POST :   api/users
// @disc      :   Register route
// @access    :   Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter a Unique Email').isEmail(),
        check('password', 'Please enter a Password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body;

        // anything that returns promise needs await in async-----------------------------
        try {
            // See if user already exists
            let user = await User.findOne({ email }) // a user can have only one email to register.
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
            }

            //if the user is not present. to do-> pass the users email into gravatar.url method that wll gives us the url of the gravatar.
            // Get users gravatar
            const avatar = gravatar.url(email, { // read docs
                s: '200', // default size
                r: 'pg', // rating
                d: 'mm', // default
            })

            // on line 28: we used 'user' var to store the email
            // now we are storing the users info in it.  
            user = new User({ // using user model
                name,
                email,
                avatar,
                password // here password is not hashed.
            }) // we have yet not saved the user, before savng the user we will encrypt the password and then use save method.

            // Encrypt password
            const salt = await bcrypt.genSalt(10); // read docs // generate encypt of 10 rounds.

            user.password = await bcrypt.hash(password, salt); // finally password hashed...

            await user.save();

            // Return jsonWebToken
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                })
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;