const express = require('express');
const router = express.Router();

const db = require('./models');
  const { Gallery } = db;

router.post('/', function(req, res) {
    Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
      })
      .then(function (gallery) {
        res.redirect('/');
      });
  });

router.get('/new', function (req, res) {
  res.render('./partials/new')
});

router.get('/:id', function (req, res) {
  Gallery.findById(req.params.id)
    .then(function (gallery) {
    console.log('here', req.params.id)
      res.render('./partials/photo', {gallery: gallery} );
    });
});


module.exports = router;