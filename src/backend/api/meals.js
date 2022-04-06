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

async function getMeals(query) {
  let mealsArray = await knex('meal');
  let reservationsArray = await knex('reservation');

  if ('limit' in query && 'maxPrice' in query) {
    const maxPriceMealLimit = mealsArray
      .filter((meal) => meal.price < Number(query.maxPrice))
      .slice(0, Number(query.limit));
    if (isNaN(Number(query.limit)) || isNaN(Number(query.maxPrice))) {
      return 'provde a number';
    }
    if (0 < maxPriceMealLimit.length) {
      return maxPriceMealLimit;
    } else {
      return 'no cheap meal matched';
    }
  }

  if ('limit' in query) {
    return mealsArray.slice(0, Number(query.limit));
  }
  if ('maxPrice' in query) {
    if (isNaN(Number(query.maxPrice))) {
      return 'provide a number';
    }
    const maxPrice = mealsArray.filter(
      (meal) => meal.price < Number(query.maxPrice),
    );
    if (maxPrice.length > 0) {
      return maxPrice;
    } else {
      return 'no cheap meal found';
    }
  }
  if ('title' in query) {
    const title = mealsArray.filter((meal) =>
      meal.title.toLowerCase().includes(query.title.toLowerCase()),
    );
    if (title.length < 1) {
      return 'No meal found matching title';
    }
    return title;
  }
  // method1
  if ('reservationAvailable' in query) {
    let reservationAvailable = mealsArray.map((meal) => {
      let mealtotalReservation = reservationsArray
        .filter((reservation) => meal.id === reservation.meal_id)
        .map((newMeal) => newMeal.number_of_guests)
        .reduce((one, another) => one + another, 0);
      return {
        ...mealsArray,
        'Total Reservation': mealtotalReservation,
        'Available Reservation': meal.max_reservations - mealtotalReservation,
      };
    });

    return reservationAvailable;
  }
  // method2
  if ('availableReservations' in query) {
    const reservationsAvailable = await knex('meal')
      .join('reservation', 'meal.id', '=', 'reservation.meal_id')
      .select(
        'meal.id',
        'reservation.meal_id',
        'title',
        'when',
        'meal.created_date',
        'price',
        'max_reservations',
        knex.raw('SUM(number_of_guests) AS toal_guests'),
        knex.raw(
          '(max_reservations-SUM(number_of_guests)) AS "Available Reservation"',
        ),
      )
      .where('max_reservations', '>', 'number_of_guests')
      .groupBy('meal_id');
    const available = reservationsAvailable.filter(
      (reservation) => reservation.max_reservations > reservation.toal_guests,
    );

    return available;
  }
  if ('createdAfter' in query) {
    const MealsCreatedAfter = mealsArray.filter(
      (meal) =>
        new Date(meal.created_date).getTime() >
        new Date(query.createdAfter).getTime(),
    );
    if (MealsCreatedAfter.length === 0) {
      return 'No meal found created in this date';
    }
    return MealsCreatedAfter;
  }

  return mealsArray;
}

// Meals based on query
//GET api/meals/
router.get('/', async (request, response) => {
  const mealsArray = await getMeals(request.query);
  response.json(mealsArray);
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
    console.log(error);
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
    console.log(error);
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
    // how to validate if price is sent as string???
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
    console.log(error);
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
    console.log(error);
    response.status(500).json({
      status: 'failed',
      message: `internal server error in Deletes meal by id ${error}`,
    });
  }
});

module.exports = router;
