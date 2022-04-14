const express = require('express');
const { sum, limit } = require('../database');
const router = express.Router();
const knex = require('../database');

// to validate data received from user to post/Put to db

const mealColumns = new Set([
  'title',
  'description',
  'location',
  'when',
  'max_reservations',
  'price',
  'created_date',
]);

function checkValidData(data) {
  try {
    let validData = {};
    for (const key in data) {
      // checking if the mealColumns has the key
      if (mealColumns.has(key)) {
        validData[key] = data[key];
      }
    }
    if ('limit' in validData) {
      if (typeof validData.limit !== 'number') {
        throw new Error();
      }
    }
    if ('price' in validData) {
      if (typeof validData.price !== 'number') {
        throw new Error();
      }
    }
    if ('max_reservation' in validData) {
      if (typeof validData.max_reservation !== 'number') {
        throw new Error();
      }
    }
    if ('when' in validData) {
      const parsedDate = new Date(validData.when);
      if (isNaN(parsedDate)) {
        throw new Error();
      }
    }
    return validData;
  } catch (error) {
    console.log(error);
    response.status(500).json({
      status: 'failed',
      message: `internal server error in checkValidData ${error}`,
    });
  }
}

// Meals based on query
//GET api/meals/
router.get('/', async (request, response) => {
  const query = request.query;
  let meals = knex('meal');

  if ('limit' in query) {
    const limit = Number(query.limit);
    if (isNaN(query.limit)) {
      return response.send('Please provide limit a number');
    }
    meals = meals.limit(limit);
  }

  if ('maxPrice' in query) {
    const maxPrice = Number(query.maxPrice);
    if (isNaN(maxPrice)) {
      return response.send(' provide maxprice a number');
    } else {
      meals = meals.where('meal.price', '<=', maxPrice);
    }
  }
  if ('title' in query) {
    const title = query.title.toLowerCase();
    if (!isNaN(query.title)) {
      return response.send('Not a valid title');
    } else {
      meals = meals.where('meal.title', 'like', '%' + title + '%');
    }
  }

  if ('createdAfter' in query) {
    const createdAfter = new Date(query.createdAfter).getTime();
    meals = meals.where('meal.created_date', '<', createdAfter);
  }
  if ('availableReservations' in query) {
    meals = meals
      .join('reservation', 'meal.id', '=', 'reservation.meal_id')
      .select(
        'meal.id',
        'title',
        'max_reservations',
        knex.raw('SUM(number_of_guests) AS total_guests'),
        knex.raw(
          '(max_reservations-SUM(number_of_guests)) AS "Available Reservation"',
        ),
      )
      .where('max_reservations', '>', 'number_of_guests')
      .groupBy('meal_id')
      .having(knex.raw('(max_reservations-SUM(number_of_guests)) > 0'));
  }

  try {
    const mealsResult = await meals;

    if (mealsResult.length < 1) {
      response.send(' no meal found');
    } else {
      response.json(mealsResult);
    }
  } catch (error) {
    response.status(500).json({
      status: 'failed',
      message: `internal server error in 'query based search'
      //GET meals api/meals/  ${error}`,
    });
  }
});

// Adds a new meal
// POST api/meals/
router.post('/', async (request, response) => {
  try {
    const validData = checkValidData(request.body);
    if (!validData) {
      return response.status(400).json({
        status: 'Failed',
        Error: 'Valid data was not provided.',
        message: {
          date: 'Dates format must me (YYYY-MM-DD HH:MM:SS)',
          price: 'Price and max_reservation must be integers',
        },
      });
    }
    const mealPost = await knex('meal').insert(validData);

    response.status(201).json({
      status: 'Success',
      message: `Created ${mealPost}`,
    });
  } catch (error) {
    response.status(500).json({
      status: 'failed',
      message: `internal server error in POST api/meals/ ${error}`,
    });
  }
});

// Return meal by id
// GET api/meals/2
router.get('/:id', async (request, response) => {
  try {
    const mealByID = await knex('meal').where('id', request.params.id);

    if (mealByID.length === 0) {
      return response.status(404).json({
        status: 'Failed',
        error: 'Meal not found',
        message: 'Invalid ID',
      });
    }
    response.json(mealByID);
  } catch (error) {
    response.status(500).json({
      status: 'failed',
      message: `internal server error  GET api/meals/:id ${error}`,
    });
  }
});

// Update meal by id
// PUT api/meals/2
router.put('/:id', async (request, response) => {
  try {
    const validData = checkValidData(request.body);
    const checkedId = await knex('meal').where({ id: request.params.id });
    if (Object.keys(validData).length === 0) {
      return response.status(400).json({
        status: 'Failed',
        Error: 'Valid data was not provided.',
        message: {
          date: 'Dates format must me (YYYY-MM-DD HH:MM:SS)',
          price: 'Price and max_reservation must be integers',
        },
      });
    }

    if (checkedId.length === 0) {
      return response.status(404).json({
        status: 'Failed',
        error: 'Meal not found',
        message: 'Invalid ID',
      });
    }
    const mealUpdateByID = await knex('meal')
      .where({ id: request.params.id })
      .update(validData);

    response.status(201).json({
      status: 'Succes',
      message: 'Updated',
      updated: mealUpdateByID,
    });
  } catch (error) {
    response.status(500).json({
      status: 'failed',
      message: `internal server error  PUT api/meals/:id ${error}`,
    });
  }
});

// Deletes meal by id
// DELETE api/meals/2
router.delete('/:id', async (request, response) => {
  try {
    const checkedId = await knex('meal').where({ id: request.params.id });
    if (checkedId.length === 0) {
      return response.status(404).json({
        status: 'Failed',
        error: 'Meal not found',
        message: 'Invalid ID',
      });
    }
    const mealDeleteByID = await knex('meal')
      .where({ id: request.params.id })
      .delete(request.body);
    response.json({
      status: 'Success',
      message: `Deleted`,
      deleted: mealDeleteByID,
    });
  } catch (error) {
    response.status(500).json({
      status: 'failed',
      message: `internal server error in Deletes meal by id ${error}`,
    });
  }
});

module.exports = router;
