const exp = require('constants');
const express = require ('express');

const app = express()
const path = require('path');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

//custom middleware
app.use(logger)

//Cross Origin Resource Sharing
const whitelist = ['https://www.yoursite.com' , 'http://127.0.0.1:5500' , 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
//third party middleware
app.use(cors(corsOptions));

//Built-in middleware
app.use(express.urlencoded({extended:false})) //handle form data
app.use(express.json()) // handle json data
app.use('/' ,express.static(path.join(__dirname, './public')))
app.use('/subdir' , express.static(path.join(__dirname, './public')));

app.use('/' , require('./routes/root'));
app.use('/subdir' , require('./routes/subdir'));

//Create Routing -API
app.use('/employees' , require('./routes/api/employees'));


//get
// app.get('^/$|/index(.html)?', (req, res) => {
//     //res.send('Hello!!');
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// })

// //new get
// app.get('/new-page(.html)?', (req, res) => {
//     //res.send('Hello!!');
//     res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
// })

// //redirect
// app.get('/old-page(.html)?', (req, res) => {
//     //res.send('Hello!!');
//     res.redirect(301, 'new-page.html');
// })

/*
//next keyword
app.get('/hello(.html)?' , (req, res , next) => {
    console.log("Try to load the hello.html page");
}, (req, res) => {
    console.log("This is hello world page");
})

const one = (req, res, next) => {
    console.log('one');
    next()
}
const two = (req, res, next) => {
    console.log('two');
    next()
}
const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}
app.get('/chain(.html)?', [one, two, three])

*/
//404
// app.get('/*', (req, res) => {
//     //res.send('Hello!!');
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// })
app.all('*' , (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views' , '404.html'));
    } else if (req.accepts('json')) {
        res.json({"error" : "404 Not found"});
    } else {
        res.type('txt').send("404 Not found");
    }
})

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
