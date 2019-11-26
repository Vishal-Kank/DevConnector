const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

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

//----------------------------------------------------------------------------------------------------------


// @rout GET :   DELETE api/profile/
//               (Delete user profile)
// @desc     :   Delete user, profile & post.
// @access   :   Private
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id });// Profile removed
        await User.findOneAndRemove({ _id: req.user.id });//User removed
        res.json({ msg: 'User removed!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})

//----------------------------------------------------------------------------------------------------------

// @rout     :   PUT api/profile/experience
//               (add experience to user profile)
// @desc     :   Add experience.
// @access   :   Private
router.put('/experience', [auth, [
    check('title', 'Title is required.').not().isEmpty(),
    check('company', 'Company name is required').not().isEmpty(),
    check('from', 'from date is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExp);
        await profile.save();

        res.status(200).json(profile);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error');
    }
})

//----------------------------------------------------------------------------------------------------------

// @route     :   Delete api/profile/experience
//               (remove experience to user profile)
// @desc     :   remove experience.
// @access   :   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.status(200).json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error!');
    }
});

//----------------------------------------------------------------------------------------------------------

// @route     :   PUT api/profile/education
//               (add education to user profile)
// @desc     :   Add education.
// @access   :   Private

router.put('/education',
    [auth, [
        check('school', 'School name required.').not().isEmpty(),
        check('fieldofstudy', 'field of study required').not().isEmpty(),
        check('from', 'from date is required.').not().isEmpty()
    ]],
    async (req, res) => {
        errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { school, degree, fieldofstudy, from, to, description, current } = req.body;
        const newEdu = { school, degree, fieldofstudy, from, to, description, current };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        }
        catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error!');
        }
    });

//----------------------------------------------------------------------------------------------------------

// @route     :   Delete api/profile/education/:edu_id
//               (remove education to user profile)
// @desc     :   remove education.
// @access   :   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education.map(edu => edu.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        return res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error!');
    }
});


//----------------------------------------------------------------------------------------------------------

// @route     :   GET api/profile/github/:username
//               (get github of user profile)
// @desc     :   Get users repos from Github.
// @access   :   Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5
                    &sort=created:asc
                    &client_id=${config.get('githubClientId')}
                    &client_secret=${config.get('githubSecret')}`,

            method: 'GET',

            headers: { 'user-agent': 'node.js' }
        };
        request(options, (error, response, body) => {
            if (error) console.log(error);
            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'No Github profile found.' })
            }
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error!');
    }
});

//-----------------------------------------------------------------------------------------------------------
module.exports = router;
