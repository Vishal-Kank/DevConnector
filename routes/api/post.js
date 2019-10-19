const express = require('express');
const router = express.Router();

// @rout GET :   api/post
// @disc     :   Test route
// @access   :   Public

router.get('/', (req, res) => {
    res.send('Post Rout Working...');
})

module.exports = router;