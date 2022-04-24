import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="homeSection">
      <div className="banner"></div>
      <div className="div-center">
        <h1>Book your table now</h1>

        <Link exact to={`/reservation/addReservaion`}>
          <button>Reserve Now</button>
        </Link>
      </div>
      <div className="div-3">
        <div>
          <h1>Best Pizza</h1>
          <img
            src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395__480.jpg"
            alt="Pizza"
            height="140px"
          />
          <a href="/all-meals/3">More ...</a>
        </div>
        <div>
          <h1>Best Pita</h1>
          <img
            src="https://mandekogebogen.dk/image/box/2130725/980/50000.jpg?oversize=1"
            alt="Pita Bread"
            height="140px"
          />
          <a href="/all-meals/5">More ...</a>
        </div>
        <div>
          <h1>Best Burger</h1>
          <img
            src="https://gastrofun.dk/wp-content/uploads/2020/04/Hjemmelavet-Burger-Shack-Burger-1.jpg"
            alt=""
            height="140px"
          />
          <a href="/all-meals/4">More ...</a>
        </div>
      </div>
    </div>
  );
}
