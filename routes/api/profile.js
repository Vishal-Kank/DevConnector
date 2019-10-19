const express = require('express');
const router = express.Router();

// @rout GET :   api/profile
// @disc     :   Test route
// @access   :   Public

router.get('/', (req, res) => {
    res.send('Profile Rout Working...');
})

module.exports = router;