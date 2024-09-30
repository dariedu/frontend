import React from 'react';

// Интерфейс для пропсов CardPromotion
interface PromotionProps {
  image: string;
  points: string;
  date: string;
  title: string;
  address: string;
}

const CardPromotion: React.FC<PromotionProps> = ({
  image,
  points,
  date,
  title,
  address,
}) => {
  return (
    <div className="w-[159px] bg-white rounded-[16px] shadow-md overflow-hidden flex flex-col h-[169px]">
      {/* Image Section */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-[159px] h-[112px] object-cover rounded-[16px]"
        />
        {/* Points Badge */}
        <div className="absolute top-2 left-2 bg-light-brand-green text-light-gray-white px-2 py-1 rounded-full font-gerbera-sub1">
          {points}
        </div>
        {/* Date Badge */}
        <div className="flex justify-center items-center absolute top-2 right-2 w-[28px] h-[28px] bg-light-gray-white text-light-gray-black px-2 py-1 rounded-full font-gerbera-sub2">
          {date}
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-1 text-left mt-[6px]">
        <p className="font-gerbera-sub2 text-light-gray-black">{title}</p>
        <p className="font-gerbera-sub1 text-light-gray-3">{address}</p>
      </div>
    </div>
  );
};

export default CardPromotion;
