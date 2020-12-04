const express = require('express');
const participants = require('./participants');
const meetings = require('./meetings');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/meetings', meetings);
router.use('/participants', participants);

module.exports = router;
