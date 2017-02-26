// jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const galleryRouter = require('./galleryRouter.js');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
let path = require('path');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CONFIG = require('./config/config.json');
const saltRounds =10;
const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extend: true}));
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({
  secret: CONFIG.SESSION_SECRET,
  store: new RedisStore()
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/secret', isAuthenticated);
  app.use('/gallery', galleryRouter);

//  const authenticate = (username, password) => {
//   // queries user data from the DB
//  return Auth.findOne({where: {username: username, password: password}});

// };
  const hashCheck = (username, password, cb) => {
    // bcrypt.compare(password, username.password, function(err, res) {

    //   return res;
    // });
    return Auth.findOne({where: {username: username}})
            .then(function (user) {
              bcrypt.compare(password, user.password, function(err, res) {
                console.log('my res', res);
              return cb(res === true);
              });
            });
  };

passport.use(new LocalStrategy(
   function (username, password, done) {
  console.log('hey username, password: ', username, password);
  //returns results of query using promises and passes it into be checked
      hashCheck(username, password, function (isTrue) {
        console.log('is true', isTrue);

        if(isTrue) {
        return done(null, username);

        }else{
          return done(null, false);
        }
      });
   }
));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});


const db = require('./models');
  const { Gallery } = db;
  const { Auth } = db;

  const hbs = handlebars.create({
      extname: '.hbs',
      default: 'app'
  });
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');

  app.get('/', function (req, res) {
    Gallery.findAll()
    .then(function (gallery) {
      res.render('index', {
        gallery: gallery
      });
    });
  });

  //authentication beyon this point

  function isAuthenticated (req, res, next) {
    if(req.isAuthenticated()){
      next();
    }else{
      console.log('NO i havent');
      res.redirect('/login');
    }
  }


app.get('/user/new', function (req, res){

  res.render('./partials/users');

});

app.post('/user/new', (req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {

    Auth.create({
      username: req.body.username,
      password: hash
      })
      .then(function (gallery) {
        res.redirect('/');
      });
    });

  });
});
  app.post('/login', passport.authenticate('local',

      {successRedirect: '/',
      failureRedirect: '/login'}));

  app.get('/secret', function (req, res) {
    res.render('./secret');
  });


  app.get('/login', function (req, res) {
    res.render('./login');
  });

  // app.post('/login', function(req, res) {
  //   Auth.create({
  //     username: req.body.username,
  //     password: req.body.password,
  //     })
  //     .then(function (gallery) {
  //       res.redirect('/');
  //     });
  // });


  app.listen(3000, function() {
    db.sequelize.sync();
  });
