import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../mealSharing.css';

export function ReviewSpecific({ match }) {
  const id = Number(match.params.id);

  const [reviews, setReviews] = useState([]);
  const history = useHistory();

  const fetchItem = async () => {
    const data = await fetch('http://localhost:3000/api/reviews');
    const jsonData = await data.json();

    console.log(jsonData);
    setReviews(jsonData);
  };
  useEffect(() => {
    fetchItem();
  }, []);
  const reviewSpecific = reviews.filter((review) => review.meal_id === id);
  console.log(reviewSpecific);

  function handleClickDeleteReview(ID) {
    fetch(`http://localhost:3000/api/reviews/${ID}`, {
      method: 'DELETE',
    });
    // history.push('/');
  }
  return (
    <>
      <h1>Reviews specific page</h1>
      <i>
        <b>This meal has got {reviewSpecific.length} reviews</b>
      </i>

      {reviewSpecific.length === 0 ? (
        <>
          <Link exact to={'/addReview'}>
            {<p>Add a review for this meal</p>}
          </Link>
          <Link exact to={'/reviews'}>
            {<p>view all reviews</p>}
          </Link>
        </>
      ) : (
        <>
          <Link exact to={'/reviews'} title="view all reviews">
            {<p>view all reviews</p>}
          </Link>
          <Link exact to={'/addReview'}>
            {<p>Add review </p>}
          </Link>
          <section className="display-container">
            {reviewSpecific.map((review, index) => (
              <section key={index} className="display-item">
                <Link
                  exact
                  to={`/menu/${review.meal_id}`}
                  title="click to view the specific meal for this review "
                >
                  <h3>Review: {review.title}</h3>
                  <p>Ratings: {review.stars}</p>
                  <p>{review.description}</p>
                  <p> Review Date: {review.created_date.slice(0, 10)}</p>
                </Link>

                <button onClick={() => handleClickDeleteReview(review.id)}>
                  Delete Review
                </button>
                <Link
                  exact
                  to={`/editReview/${review.id}`}
                  title="click to edit this review "
                >
                  <button>Edit Review</button>
                </Link>
              </section>
            ))}
          </section>
        </>
      )}
    </>
  );
}
