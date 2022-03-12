const express = require('express');
const { sum } = require('../database');
const router = express.Router();
const knex = require('../database');

// Returns all reviews
// GET api/reviews/
router.get('/', async(request, response) => {
    try {
        const getAllReviews = await knex('review'); //.select('title');
        response.json(getAllReviews);
    } catch (error) {
        throw error;
    }
});

// Adds a new review
// POST api/reviews/
router.post('/', async(request, response) => {
    try {
        const postReservation = await knex('review').insert({
            title: request.body.title,
            description: request.body.description,
            stars: request.body.stars,
            created_date: request.body.created_date,
            meal_id: request.body.meal_id,
        });
        response.json(postReservation);
    } catch (error) {
        throw error;
    }
});

// Returns reviews by id
// GET api/reviews/2
router.get('/:id', async(request, response) => {
    try {
        const getreviewByID = await knex('review').where('id', request.params.id);
        response.json(getreviewByID);
    } catch (error) {
        throw error;
    }
});

// Updates the review by id
// PUT api/reviews/2
router.put('/:id', async(request, response) => {
    try {
        const updateReviewByID = await knex('review')
            .where({ id: request.params.id })
            .update(request.body);
        response.json(updateReviewByID);
    } catch (error) {
        throw error;
    }
});

//Deletes the reviews by id
// DELETE api/reviews/2
router.delete('/:id', async(request, response) => {
    try {
        const deleteReviewByID = await knex('review')
            .where({ id: request.params.id })
            .delete(request.body);
        response.json(deleteReviewByID);
    } catch (error) {
        throw error;
    }
});

module.exports = router;