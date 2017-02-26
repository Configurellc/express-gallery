const express = require('express');
const router = express.Router();

const db = require('./models');
const { Gallery } = db;
const {Auth} = db;


function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()){
    next();
  }else{
    console.log('NO i havent');
    res.redirect('/login');
  }
}
router.post('/', isAuthenticated, function(req, res) {
    Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
      })
      .then(function (gallery) {
        res.redirect('/');
      });
  });

router.get('/new', isAuthenticated, function (req, res) {
  res.render('./partials/new')
});

router.get('/:id', function (req, res) {
  Gallery.findById(req.params.id)
    .then(function (gallery) {
    console.log('here', req.params.id)
      res.render('./partials/photo', {gallery: gallery} );
    });
});

router.get('/:id/edit', isAuthenticated, function (req, res) {
  Gallery.findById(req.params.id)
    .then(function (gallery) {
      res.render('./partials/edit', {gallery: gallery});
    })
})

router.put('/:id/edit', isAuthenticated, function (req, res) {
  Gallery.findById(req.params.id)
    .then(function (gallery) {
      if(gallery) {
        gallery.updateAttributes({
          author: req.body.author,
          link: req.body.link,
          description: req.body.description
        });
      }
      res.render('./partials/photo', {gallery: gallery});
    });
});

router.delete('/:id', isAuthenticated, function (req, res) {
  Gallery.findById(req.params.id)
    .then(function (gallery) {
      if(gallery) {
        gallery.destroy();

      }
    });
  res.redirect('/');
});


module.exports = router;