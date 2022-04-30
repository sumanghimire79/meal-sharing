import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="homeSection">
      <div className="banner"></div>
      <div className="div-center">
        <h1>Book your table now</h1>

        <Link exact to={`/addReservaion`}>
          <button>Reserve Now</button>
        </Link>
      </div>
      <div className="div-3">
        <div>
          <h1>Best Pizza</h1>
          <img
            className="bestItem"
            src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395__480.jpg"
            alt="Pizza"
          />
          <Link exact to={`/menu/3`}>
            More ...
          </Link>
        </div>
        <div>
          <h1>Best Pita</h1>
          <img
            className="bestItem"
            src="https://mandekogebogen.dk/image/box/2130725/980/50000.jpg?oversize=1"
            alt="Pita Bread"
          />
          <Link exact to={`/menu/5`}>
            More ...
          </Link>
        </div>
        <div>
          <h1>Best Burger</h1>
          <img
            className="bestItem"
            src="https://gastrofun.dk/wp-content/uploads/2020/04/Hjemmelavet-Burger-Shack-Burger-1.jpg"
            alt=""
          />
          <Link exact to={`/menu/4`}>
            More ...
          </Link>
        </div>
      </div>
    </div>
  );
}
