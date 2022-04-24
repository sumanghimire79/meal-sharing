import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../mealSharing.css';

export function Menu() {
  const [meals, setMeals] = useState([]);
  const [data, setData] = useState([]);
  const [serchText, setSerchText] = useState();
  const [correctData, setCorrectData] = useState([]);
  const [isData, setIsData] = useState(false);

  const fetchItem = async () => {
    const data = await fetch('http://localhost:3000/api/meals');
    const jsonData = await data.json();
    console.log(jsonData);
    setMeals(jsonData);
  };

  useEffect(() => {
    fetchItem();
  }, []);
  console.log(meals);

  const excludeSearch = [
    'id',
    'when',
    'created_date',
    'price',
    'max_reservations',
    'location',
  ];

  const filterData = (value) => {
    const lowerCaseValue = value.toLowerCase().trim();
    console.log(lowerCaseValue);

    const filteredData = meals.filter((meal) => {
      return Object.keys(meal).some((key) => {
        return excludeSearch.includes(key)
          ? false
          : meal[key].toString().toLowerCase().includes(lowerCaseValue);
      });
    });
    console.log(filteredData);
    setIsData(filteredData.length === 0 ? true : false);
    setData(filteredData);
  };
  const handleChange = (value) => {
    setSerchText(value);
    filterData(value);
  };

  useEffect(() => {
    setCorrectData(data.length === 0 ? meals : data);
  }, [handleChange]);

  const showData = correctData.map((meal) => {
    return (
      <section className="display-item" key={meal.id}>
        <Link exact to={`/menu/${meal.id}`}>
          <h1 key={meal.id}>{meal.title}</h1>
          <span> Price :{meal.price}</span>
        </Link>
      </section>
    );
  });

  return (
    <div>
      <h1> All available {correctData.length} meals</h1>
      {/* when checkbox is checked should filter out only available meal for reservation : under working */}
      <p>available reservation:</p>
      <input type="checkbox" />
      <>
        <Link exact to={'/addMeal'}>
          {<p>Add a meal </p>}
        </Link>
      </>
      <form onSubmit={handleChange}>
        <input
          value={serchText}
          type="text"
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          placeholder="search meal ..."
        />
      </form>
      <section className="display-container">
        {isData === true ? <span>No data</span> : showData}
      </section>
    </div>
  );
}
