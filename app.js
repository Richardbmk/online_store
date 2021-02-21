const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');


const User = require('./models/user');

// MongoDB Atlas configuration
require('dotenv').config();
const db_user = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const db_url_cloud = `mongodb+srv://${db_user}:${db_password}@cluster0-a0s4s.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const store = new MongoDBStore({
    uri: db_url_cloud,
    collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(__dirname + "/public"));
app.use('/images', express.static(__dirname + "/images"));
app.use(session( {
    secret: 'this is a very secrete information that I put here for dev',
    resave: false, 
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use((req, res, next) => {
    // throw new Error('Sync Dummy Error');
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        // throw new Error('Dummy');
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

// app.use((error, req, res, next) => {
//     // res.redirect('/500');
//     res.status(500).render('500', { 
//         pageTitle: 'Error!',
//          path: '500',
//          isAuthenticated: req.session.isLoggedIn
//     });
// });


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
