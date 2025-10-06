import React from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/slick-custom.css';

// Custom arrow components
const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full z-10 right-4`}
      style={{ ...style, display: 'flex' }}
      onClick={onClick}
    >
      <ChevronRight className="text-white w-6 h-6" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full z-10 left-4`}
      style={{ ...style, display: 'flex' }}
      onClick={onClick}
    >
      <ChevronLeft className="text-white w-6 h-6" />
    </div>
  );
};

interface ImageSliderProps {
  images: string[];
  title: string;
  initialSlide?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, title, initialSlide = 0 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    initialSlide,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: 'w-full h-full',
    dotsClass: 'slick-dots !bottom-4',
    appendDots: (dots: any) => (
      <div className="absolute bottom-0 left-0 right-0">
        <ul className="m-0 p-0 flex justify-center">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div className="w-2 h-2 mx-1 rounded-full bg-white/50 hover:bg-white transition-colors cursor-pointer" />
    ),
  };

  return (
    <div className="relative w-[93%] mx-auto aspect-[9/16] mb-8 rounded-xl overflow-hidden group">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full h-full relative">
            <img
              src={image}
              alt={`${title} - ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {index + 1} / {images.length}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
