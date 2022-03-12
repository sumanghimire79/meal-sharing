const express = require('express');
const { sum, limit } = require('../database');
const router = express.Router();
const knex = require('../database');

//Returns  meals based on query
//GET api/meals/
router.get('/', async(request, response) => {
    try {
        let mealsArray = await knex('meal');
        let reservationsArray = await knex('reservation');

        //limit and maxPrice
        if ('limit' in request.query && 'maxPrice' in request.query) {
            const maxPriceMealLimit = mealsArray
                .filter((meal) => meal.price < Number(request.query.maxPrice))
                .slice(0, Number(request.query.limit));
            if (
                isNaN(Number(request.query.limit)) ||
                isNaN(Number(request.query.maxPrice))
            ) {
                return response.send('provde a number');
            } else if (0 < maxPriceMealLimit.length) {
                return response.json(maxPriceMealLimit);
            } else {
                response.send('no meal matched');
            }
        }

        // Get meals that has a price smaller than maxPrice
        // api/meals?maxPrice=90
        if ('maxPrice' in request.query) {
            if (isNaN(Number(request.query.maxPrice))) {
                return response.send('provide a number');
            }

            const maxPrice = mealsArray.filter(
                (meal) => meal.price < Number(request.query.maxPrice),
            );

            if (maxPrice.length > 0) {
                return response.send(maxPrice);
            } else {
                return response.send('no cheap meal found');
            }
        }

        // api/meals?title=Indian%20platter (%20 is a space character)
        if ('title' in request.query) {
            const title = mealsArray.filter((meal) =>
                meal.title.toLowerCase().includes(request.query.title.toLowerCase()),
            );
            if (title.length < 1) {
                return response
                    .status(404)
                    .json({ Error: 'No meal found matching title' });
            }
            return response.json(title);
        }

        // Get meals that has been created after the date
        // api/meals?createdAfter=2019-04-05
        if ('createdAfter' in request.query) {
            const createdAfter = mealsArray.filter(
                (meal) =>
                new Date(meal.created_date).getTime() >
                new Date(request.query.createdAfter).getTime(),
            );
            if (createdAfter.length === 0) {
                return response
                    .status(404)
                    .json({ Error: 'No meal found created this date' });
            }
            return response.json(createdAfter);
        }

        // Only specific number of meals
        // api / meals ? limit = 4
        if ('limit' in request.query) {
            return response.send(mealsArray.slice(0, Number(request.query.limit)));
        }

        // method 1
        // Get meals that still has available reservations
        // api/meals?availableReservations=true
        if ('reservationAvailable' in request.query) {
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

            return response.json(reservationAvailable);
        }

        // method 2
        // Get meals that still has available reservations
        // api/meals?availableReservations=true
        if ('availableReservations' in request.query) {
            const availableReservations = await knex('meal')
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
            const available = availableReservations.filter(
                (availableReservation) =>
                availableReservation.max_reservations >
                availableReservation.toal_guests,
            );

            return response.json(available);
        }

        response.json(mealsArray);
    } catch (error) {
        throw error;
    }
});

// Adds a new meal
// POST api/meals/
router.post('/', async(request, response) => {
    try {
        const postMeal = await knex('meal').insert({
            title: request.body.title,
            description: request.body.description,
            location: request.body.location,
            when: request.body.when,
            max_reservations: request.body.max_reservations,
            price: request.body.price,
            created_date: request.body.created_date,
        });

        response.json(postMeal);
    } catch (error) {
        throw error;
    }
});

// Returns meal by id
// GET api/meals/2
router.get('/:id', async(request, response) => {
    try {
        const getMealByID = await knex('meal').where('id', request.params.id);
        response.json(getMealByID);
    } catch (error) {
        throw error;
    }
});

// Updates the meal by id
// PUT api/meals/2
router.put('/:id', async(request, response) => {
    try {
        const updateMealByID = await knex('meal')
            .where({ id: request.params.id })
            .update(request.body);
        response.json(updateMealByID);
    } catch (error) {
        throw error;
    }
});

// Deletes the meal by id
// DELETE api/meals/2
router.delete('/:id', async(request, response) => {
    try {
        const deleteMealByID = await knex('meal')
            .where({ id: request.params.id })
            .delete(request.body);
        response.json(deleteMealByID);
    } catch (error) {
        throw error;
    }
});

module.exports = router;