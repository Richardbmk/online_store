const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');


const User = require('./models/user');

require('dotenv').config();
const db_url_cloud = process.env.DB_URL_CLOUD;

const store = new MongoDBStore({
    uri: db_url_cloud,
    collection: 'sessions'
});
const csrfProtection = csrf();

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session( {
    secret: 'this is a very secrete information that I put here for dev',
    resave: false, 
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);


mongoose
    .connect(db_url_cloud)
    .then(() => {
        app.listen(3000, () =>{
            console.log("This server in running in port 3000");
        }); 
    })
    .catch(err => {
        console.log(err);
    });



/* 
app.listen(3000, () =>{
    console.log("This server in running in port 3000");
}); 
*/