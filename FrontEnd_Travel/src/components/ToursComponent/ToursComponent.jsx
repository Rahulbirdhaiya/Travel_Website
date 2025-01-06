
import React, { useEffect, useState } from 'react';

const ToursComponent = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/tours')
      .then(response => response.json())
      .then(data => setTours(data))
      .catch(error => console.error('Error fetching tours:', error));
  }, []);

  return (
    <div>
      {tours.map(tour => (
        <div key={tour.id}>
          <h2>{tour.title}</h2>
          <img src={tour.photo} alt={tour.title} />
          <p>{tour.desc}</p>
          <p>Price: {tour.price}</p>
          <p>Address: {tour.address}</p>
          <p>City: {tour.city}</p>
          <p>Distance: {tour.distance}</p>
          <p>Max Group Size: {tour.maxGroupSize}</p>
          <p>Average Rating: {tour.avgRating}</p>
        </div>
      ))}
    </div>
  );
};

export default ToursComponent;