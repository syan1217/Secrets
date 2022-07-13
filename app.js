//jshint esversion:6
require('dotenv').config() //enviramental variables set up.
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//set up server:
const app = express();

//use ejs as view engine:
app.set('view engine','ejs');

//body parser: to allow the string post be human readed:
app.use(bodyParser.urlencoded({extended:true}));

//to use local css or js:
app.use(express.static('public'));

//set up mongoose:
//connection:
mongoose.connect('mongodb://localhost:27017/userDB');

//mongoose schema with encryption:
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


//console.log(process.env.SECRET);
//encryption: remember to add it before mongoose.model:
//const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });

//mongoose model:
const User = mongoose.model('User',userSchema);

//set up the route:
app.get('/',function(req,res){
  res.render("home");
});

app.get('/register',function(req,res){
  res.render("register");
});

app.get('/login',function(req,res){
  res.render("login");
});

//Post:
app.post('/register',function(req,res){
  //update a user:
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  //save the data:
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets');
    };
  });

});


app.post('/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render('secrets');

        }
      }
    };
  });

});

//to host the app:
app.listen(3000,function(){
  console.log('sucessfully hosted');
});
