import React from 'react';
import './carouselp.css';
import CarouselP from './CarouselP';
function ShowCarouselP() {
  const images = [
    '1.png',
    '2.png',
    '3.png',
  ];
  return (
    <div className="App">
      <h1>Simple React Carousel</h1>
      <CarouselP images={images} />
    </div>
  );
}
export default ShowCarouselP;