const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { page: 'Ossu FC' });
});

router.get('/about', (req, res, next) => {
  res.render('about', { page: 'About' });
});

router.get('/fc-members', (req, res, next) => {
  res.render('fc-members', { page: 'FC Members' });
});

router.get('/pictures', (req, res, next) => {
    res.render('pictures', { page: 'Pictures' });
});

router.get('/stats', (req, res, next) => {
    res.render('stats', { page: 'Stats' });
});

router.get('/faqs', (req, res, next) => {
  res.render('faqs', { page: 'FAQs' });
});

router.get('/disclaimer', (req, res, next) => {
  res.render('disclaimer', { page: "Disclaimer" });
});


module.exports = router;
