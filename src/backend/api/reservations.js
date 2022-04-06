const express = require('express');
const { sum } = require('../database');
const router = express.Router();
const knex = require('../database');

// Validating data
const reservationsColumns = new Set([
  'number_of_guests',
  'created_date',
  'contact_phonenumber',
  'contact_name',
  'contact_email',
  'meal_id',
]);
function isValidData(data) {
  let validData = {};
  for (const key in data) {
    if (reservationsColumns.has(key)) {
      validData[key] = data[key];
    } else {
      validData['Error'] = 'Error';
    }
  }

  return validData;
}

// Returns all reservations
// GET api/reservations/
router.get('/', async (request, response) => {
  try {
    const allReservations = await knex('reservation'); //.select('title');
    response.json(allReservations);
  } catch (error) {
    throw error;
  }
});

// Adds a new reservation
// POST api/reservation/
router.post('/', async (request, response) => {
  try {
    const validData = isValidData(request.body);
    if ('Error' in validData) {
      return res.status(400).json({
        status: 'failed',
        Error: 'No valid data was provided.',
        message: {
          meal_id:
            'meal_id and number_of_guests are supposed to be integers, not strings',
          columns: [
            'number_of_guests',
            'created_date',
            'contact_phonenumber',
            'contact_name',
            'contact_email',
            'meal_id',
          ],
        },
      });
    }
    const reservationPost = await knex('reservation').insert(validData);

    response.status(201).json({
      status: 'success',
      message: `Created ${reservationPost}`,
    });
  } catch (error) {
    console.log(error);
    response.status(5000).json({
      status: 'failed',
      message: `internal server error in POST api/reservation/ ${error}`,
    });
  }
});

// Returns reservation by id
// GET api/reservations/2
router.get('/:id', async (request, response) => {
  try {
    const reservaionByID = await knex('reservation').where(
      'id',
      request.params.id,
    );
    if (reservaionByID.length === 0) {
      return response.status(404).json({
        status: 'failed',
        error: 'reservation not found',
        message: 'Invalid ID',
      });
    }
    response.json(reservaionByID);
  } catch (error) {
    console.log(error);
    response.status(5000).json({
      status: 'failed',
      message: `internal server error in POST api/reservation/id ${error}`,
    });
  }
});

// Updates the reservation by id
// PUT api/reservations/2
router.put('/:id', async (request, response) => {
  try {
    const validData = isValidData(request.body);

    const checkedId = await knex('reservation').where({
      id: request.params.id,
    });
    if ('Error' in validData) {
      return response.status(400).json({
        status: 'failed',
        Error: 'No valid data was provided.',
        message: {
          date: 'make sure the dates match this format (YYYY-MM-DD HH:MM:SS)',
          price:
            'price and max_reservation are supposed to be integers, not strings',
        },
      });
    }
    if (checkedId.length === 0) {
      return response.status(404).json({
        status: 'failed',
        error: 'reservation not found',
        message: 'Invalid ID',
      });
    }
    const reservationUpdateById = await knex('reservation')
      .where({ id: request.params.id })
      .update(validData);
    response.status(201).json({
      status: 'succes',
      message: 'Updated',
      updated: reservationUpdateById,
    });
  } catch (error) {
    console.log(error);
    response.status(5000).json({
      status: 'failed',
      message: `internal server error in put api/reservation/by id ${error}`,
    });
  }
});

//Deletes the reservation by id
// DELETE api/reservation/2
router.delete('/:id', async (request, response) => {
  try {
    const checkedId = await knex('reservation').where({
      id: request.params.id,
    });
    if (checkedId.length === 0) {
      return response.status(404).json({
        status: 'failed',
        error: 'reservation not found',
        message: 'Invalid ID',
      });
    }

    const reservationDeleteByID = await knex('reservation')
      .where({ id: request.params.id })
      .delete(request.body);
    response.json({
      status: 'success',
      message: `Deleted`,
      deleted: reservationDeleteByID,
    });
  } catch (error) {
    console.log(error);
    response.status(5000).json({
      status: 'failed',
      message: `internal server error in delete api/meals/ by id ${error}`,
    });
  }
});

module.exports = router;
