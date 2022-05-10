const express = require('express');
const router = express.Router();
const knex = require('../database');

router.get('/login', async (request, response) => {
  console.log(request.query);
  if (request.query) {
    response.send({ loggedIn: true, user: request.query });
  } else {
    response.send({ loggedIn: false });
  }

  // response.send({ loggedIn: true });
});

// GET api/login/
router.get('/', async (request, response) => {
  // console.log(request.session.user);

  try {
    const allEmployee = await knex('login'); //.select('user_name');

    // const allusers = allEmployee.map((user) => user);
    // .filter((userName) => userName === request.query);

    // console.log(allusers);
    // console.log(request);
    // if (request.session.user) {
    //   response.send([...allEmployee, ...(loggedIn = true)]);
    // } else {
    //   response.send({ loggedIn: false });
    // }

    response.send(allEmployee);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: 'failed',
      message: `internal server error in get all allEmployee api/login/ ${error}`,
    });
  }
});
// router.get('/:id', (request, response) => {
//   response.send({
//     token: 'test123',
//   });
// });

router.post('/', async (request, response) => {
  try {
    const loginPost = await knex('login').insert(request.body);
    response.status(201).json({
      status: 'success',
      message: `Created ${loginPost}`,
      token: 123,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: 'failed',
      message: `internal server error in POST api/login/ ${error}`,
    });
  }
});

module.exports = router;
