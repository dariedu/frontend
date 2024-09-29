import React, { useState } from 'react';

const DeliveryType: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Активная');

  const options = ['Активная', 'Ближайшая'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (type: string) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  return (
    <div className="w-[360px] p-4">
      <div className="flex items-center space-x-2">
        {/* Selected Type with Green Background */}
        <div
          className="btn-S-GreenDefault flex items-center justify-center mr-[183px]"
          style={{
            borderRadius: '100px',
          }}
        >
          {selectedType}
        </div>

        {/* Dropdown Arrow Button */}
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center focus:outline-none w-8 h-8"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`block w-full text-left px-4 py-2 ${
                option === selectedType
                  ? 'btn-S-GreenDefault flex items-center'
                  : 'font-gerbera-sub2 text-light-gray-black hover:bg-gray-100 rounded-full'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryType;
