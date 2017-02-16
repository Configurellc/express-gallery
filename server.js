const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const galleryRouter = require('./galleryRouter.js')
const methodOverride = require('method-override')
const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extend: true}));
  app.use(methodOverride('_method'));
  app.use('/gallery', galleryRouter)

const db = require('./models');
  const { Gallery } = db;

  const hbs = handlebars.create({
      extname: '.hbs',
      default: 'app'
  });
    app.engine('hbs', hbs.engine)
    app.set('view engine', 'hbs');

  app.get('/', function (req, res) {
    Gallery.findAll()
    .then(function (gallery) {
      res.render('index', {
        gallery: gallery
      });
    });
  })



app.listen(3000, function() {
  db.sequelize.sync();
});
