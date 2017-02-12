const express = require('express');
const bodyParser = require('body-parser');
const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extend: true}));

const db = require('./models');
  const { Gallery } = db;

  app.post('/gallery', function(req, res) {
    Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
      })
      .then(function (gallery) {
        res.json(gallery);
      })
  })


app.listen(3000, function() {
  db.sequelize.sync();
});
