const express = require('express');
const { sum } = require('../database');
const router = express.Router();
const knex = require('../database');

// validating data
const reviewsColumns = new Set([
  'title',
  'description',
  'stars',
  'created_date',
  'meal_id',
]);
function isValidData(data) {
  let validData = {};
  for (const key in data) {
    if (reviewsColumns.has(key)) {
      validData[key] = data[key];
    } else {
      validData['Error'] = 'Error';
    }
  }

  return validData;
}

// Returns all reviews
// GET api/reviews/
router.get('/', async (request, response) => {
  try {
    const allReviews = await knex('review'); //.select('title');
    response.json(allReviews);
  } catch (error) {
    throw error;
  }
});

// Adds a new review
// POST api/reviews/
router.post('/', async (request, response) => {
  const validData = isValidData(request.body);

  if ('Error' in validData) {
    return response.status(400).json({
      status: 'failed',
      Error: 'No valid data was provided.',
      message: {
        spelling: 'check for spelling error',
        columns: ['title', 'description', 'stars', 'created_date', 'meal_id'],
      },
    });
  }

  const reviewPost = await knex('review').insert(validData);
  response.status(201).json({
    status: 'success ',
    message: `Created ${reviewPost}`,
  });
});

// Returns reviews by id
// GET api/reviews/2
router.get('/:id', async (request, response) => {
  try {
    const reviewByID = await knex('review').where('id', request.params.id);
    if (reviewByID.length === 0) {
      return response.status(404).json({
        status: 'failed',
        error: 'review not found',
        message: 'Invalid ID',
      });
    }

    response.send(reviewByID);
  } catch (error) {
    throw error;
  }
});

// Updates the review by id
// PUT api/reviews/2
router.put('/:id', async (request, response) => {
  try {
    const validData = isValidData(request.body);

    const iDCheck = await knex('review').where({ id: request.params.id });

    if ('Error' in validData) {
      return response.status(400).json({
        status: 'failed',
        Error: 'No valid data was provided.',
        message: {
          columns: ['title', 'description', 'stars', 'created_date', 'meal_id'],
        },
      });
    }
    if (iDCheck.length === 0) {
      return response.status(404).json({
        status: 'failed',
        error: 'review not found',
        message: 'Invalid ID',
      });
    }

    const reviewUpdateByID = await knex('review')
      .where({ id: request.params.id })
      .update(validData);

    response.status(201).json({
      status: 'succes',
      message: 'Updated',
      updated: reviewUpdateByID,
    });
  } catch (error) {
    throw error;
  }
});

//Deletes the reviews by id
// DELETE api/reviews/2
router.delete('/:id', async (request, response) => {
  try {
    const checkId = await knex('review').where({ id: request.params.id });

    console.log(checkId);
    if (checkId.length === 0) {
      return response.status(404).json({
        status: 'failed',
        error: 'review not found',
        message: 'Invalid ID',
      });
    }
    const reviewDeleteByID = await knex('review')
      .where({ id: request.params.id })
      .delete(request.body);
    response.json({
      status: 'success',
      message: `Deleted`,
      deleted: reviewDeleteByID,
    });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
