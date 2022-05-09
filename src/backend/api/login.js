const express = require('express');
const router = express.Router();
const knex = require('../database');

// GET api/login/
router.get('/', (request, response) => {
  response.send({
    token: 'test123',
  });
});

module.exports = router;
