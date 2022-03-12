const express = require('express');
const { sum } = require('../database');
const router = express.Router();
const knex = require('../database');

// Returns all reservations
// GET api/reservations/
router.get('/', async(request, response) => {
    try {
        const getAllReservation = await knex('reservation'); //.select('title');
        response.json(getAllReservation);
    } catch (error) {
        throw error;
    }
});

// Adds a new reservation
// POST api/reservation/
router.post('/', async(request, response) => {
    try {
        const postReservation = await knex('reservation').insert({
            number_of_guests: request.body.number_of_guests,
            created_date: request.body.created_date,
            contact_phonenumber: request.body.contact_phonenumber,
            contact_name: request.body.contact_name,
            contact_email: request.body.contact_email,
            meal_id: request.body.meal_id,
        });

        response.json(postReservation);
    } catch (error) {
        throw error;
    }
});

// Returns reservation by id
// GET api/reservations/2
router.get('/:id', async(request, response) => {
    try {
        const getReservaionByID = await knex('reservation').where(
            'id',
            request.params.id,
        );
        response.json(getReservaionByID);
    } catch (error) {
        throw error;
    }
});

// Updates the reservation by id
// PUT api/reservations/2
router.put('/:id', async(request, response) => {
    try {
        const updateReservationById = await knex('reservation')
            .where({ id: request.params.id })
            .update(request.body);
        response.json(updateReservationById);
    } catch (error) {
        throw error;
    }
});

//Deletes the reservation by id
// DELETE api/reservation/2
router.delete('/:id', async(request, response) => {
    try {
        const deleteReservationByID = await knex('reservation')
            .where({ id: request.params.id })
            .delete(request.body);
        response.json(deleteReservationByID);
    } catch (error) {
        throw error;
    }
});

module.exports = router;