const express = require('express');
const router = require('./routes/index');
const app = express();
const port = 3000;
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'rumpinosecret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
}));

app.use('/', router);

app.listen(port, () => {
    console.log('Listening to port ', port);
});