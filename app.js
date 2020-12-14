const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');


require('dotenv').config();
const db_url_cloud = process.env.DB_URL_CLOUD;

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


app.use((req, res, next) => {
    User.findById('5fd11273f9942b15fc7e21dd')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);


mongoose
    .connect(db_url_cloud)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "Richard",
                    email: 'richard@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
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