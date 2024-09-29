import React from 'react';

// Interface for CardPromotion props
interface PromotionProps {
  image: string;
  points: string;
  date: string;
  title: string;
  address: string;
}

// Props for the CardPromotion component
interface CardPromotionProps {
  promotions: PromotionProps[];
}

const CardPromotion: React.FC<CardPromotionProps> = ({ promotions }) => {
  return (
    <div className="space-y-4 w-[159px] h-[169px]">
      {promotions.map((promo, index) => (
        <div
          key={index}
          className="w-full bg-white rounded-[16px] shadow-md overflow-hidden flex flex-col"
        >
          {/* Image Section */}
          <div className="relative">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-[120px] object-cover rounded-t-[16px]"
            />
            {/* Points Badge */}
            <div className="absolute top-2 left-2 bg-light-brand-green text-white px-2 py-1 rounded-full text-xs font-gerbera-sub2">
              {promo.points}
            </div>
            {/* Date Badge */}
            <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full text-xs font-gerbera-sub2">
              {promo.date}
            </div>
          </div>

          {/* Text Content */}
          <div className="p-3 space-y-1">
            <p className="font-gerbera-h3 text-black">{promo.title}</p>
            <p className="text-light-gray-3 text-xs">{promo.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardPromotion;
