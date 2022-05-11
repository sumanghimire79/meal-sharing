import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [popularMeals, setPopularMeals] = useState([]);

  const fetchItem = async () => {
    const data = await fetch('/api/meals?popularMeal=true');
    const jsonData = await data.json();
    setPopularMeals(jsonData);
  };

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const popular = popularMeals.map((popularMeal, index) => {
    return (
      <div key={index} className="popularmeals">
        <Link to={`/meals/${popularMeal.id}`}>
          <h3>{popularMeal.title}</h3>
          {popularMeal.title.includes('pizza') && (
            <img
              className="bestItem"
              src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395__480.jpg"
              alt="Pizza"
            />
          )}
          {popularMeal.title.includes('pita') && (
            <img
              className="bestItem"
              src="https://mandekogebogen.dk/image/box/2130725/980/50000.jpg?oversize=1"
              alt="Pita Bread"
            />
          )}
          {popularMeal.title.includes('sandwitch') && (
            <img
              className="bestItem"
              src="https://gastrofun.dk/wp-content/uploads/2020/04/Hjemmelavet-Burger-Shack-Burger-1.jpg"
              alt="burger"
            />
          )}
          {!popularMeal.title.includes('sandwitch' || 'pita' || 'pizza') && (
            <img
              className="bestItem"
              src="data:image/png;base64,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"
              alt="food image"
            />
          )}
        </Link>
        <p>
          <strong> {popularMeal.location} </strong>
        </p>
        <p>
          Price :<strong> {popularMeal.price} </strong>
        </p>
      </div>
    );
  });

  return (
    <div className="homeSection">
      <div className="banner"></div>
      <div className="div-center">
        <h1>Book your table now</h1>

        <Link exact to={`/addReservaion`}>
          <button>Reserve Now</button>
        </Link>
      </div>
      <h2>Popular Items</h2>
      <div className="div-3">{popular}</div>
    </div>
  );
}
