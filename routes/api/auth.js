const express = require('express');
const router = express.Router();

// @rout GET :   api/auth
// @disc     :   Test route
// @access   :   Public

router.get('/', (req, res) => {
    res.send('Auth Rout Working...');
})

module.exports = router;