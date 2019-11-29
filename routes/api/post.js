const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//--------------------------------------------------------------------------------------

// @rout     :   POST api/posts
// @desc     :   Create a posts
// @access   :   Private

router.post('/',
    [
        auth,
        [
            check('text', 'Text is required.').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            return res.status(200).json(profile);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error!');
        }
    }
);

//--------------------------------------------------------------------------------------

// @rout     :   GET api/posts
// @desc     :   Get post by id
// @access   :   Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found!' });
        return res.status(200).json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found!' });
        return res.status(500).send('Server Error!');
    }
});


//--------------------------------------------------------------------------------------

// @rout     :   Delete api/posts
// @desc     :   Delete post by id
// @access   :   Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).sort({ date: -1 });
        if (!post) return res.status(404).json({ msg: 'Post not found!' });
        if (post.user.id.toString() !== req.params.id)//i.e the user that made this request is not the actual author so he cannot delete this post
            return res.status(401).json({ msg: 'Unauthorized access!' });
        await post.remove();
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found!' });
        return res.status(500).send('Server Error!');
    }
});

module.exports = router;