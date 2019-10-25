const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @rout GET :   api/profile/me(checking ift this profile exists)
// @desc     :   get current loggrd users profile
// @access   :   Private(so only user can see)

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no Profile for this user!' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});
//----------------------------------------------------------------------------------------------------------


// @rout GET :   api/profile/(coz here we are either making or updating profile) 
// @desc     :   Post updates/create to current logged in users profile
// @access   :   Private(so only user can see)

router.post('/',
    [
        auth,
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills are required').not().isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company, website, bio, location, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin
        } = req.body;

        // Build profile object
        const profileFields = {} // here we created a user's profile field in which we will add all above details like company,bio,skills,etc.

        profileFields.user = req.user.id; //add the id of user

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (bio) profileFields.bio = bio;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        //Build object for social in profileFields of user(as per Profile model)...
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                //if profile is available then update.
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            //if profile not found then create
            profile = new Profile(profileFields);
            await profile.save();
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error!');
        }

    });

//----------------------------------------------------------------------------------------------------------


// @rout GET :   api/profile/
//               (display all user profiles to show available developers)
// @desc     :   Get only available users profile
// @access   :   Public(so we can see developers)

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!');

    }
});


//----------------------------------------------------------------------------------------------------------


// @rout GET :   api/profile/user/user:id
//               (display all user profiles to show available developers)
// @desc     :   Get users profile by their user id.
// @access   :   Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ 'msg': 'Profile not found!' });
        }
        return res.json(profile);
    } catch (error) {
        if (error.kind == 'ObjectId') { // if a wrong user id object is detected...
            return res.status(400).json({ 'msg': 'Profile not found!' });
        }
        console.error(error.message);
        res.status(500).send('Server Error!');
    }
});

//-----------------------------------------------------------------------------------------------------------
module.exports = router;
