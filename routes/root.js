const express = require('express')
const router = express.Router();
const path = require('path');

//get
router.get('^/$|/index(.html)?', (req, res) => {
    //res.send('Hello!!');
    res.sendFile(path.join(__dirname, '..' , 'views', 'index.html'));
})

//new get
router.get('/new-page(.html)?', (req, res) => {
    //res.send('Hello!!');
    res.sendFile(path.join(__dirname,'..' , 'views', 'new-page.html'));
})

//redirect
router.get('/old-page(.html)?', (req, res) => {
    //res.send('Hello!!');
    res.redirect(301, 'new-page.html');
})

module.exports = router