import React from 'react';
import search from '../../assets/icons/search.svg';
import metro from '../../assets/icons/metro_station.svg';

interface ISearchProps {
  placeholder?: string;
  showSearchInput?: boolean; // Пропс для видимости поискового блока
}

const Search: React.FC<ISearchProps> = ({
  placeholder = 'Поиск по ФИО',
  showSearchInput = true,
}) => {
  // Массив с текстовой информацией
  const infoData = {
    station: 'Ст. Молодежная',
    address: 'Мск, ул. Бобруйская д.6 к.2',
    // deliveryType: 'Доставка',
  };

  return (
    <div className="bg-light-gray-white dark:bg-dark-gray-white p-4 rounded-[16px] max-w-md w-[360px]">
      {/* Секция с основной информацией */}
      <div className="flex justify-between items-center">
        <div className="flex">
          <img className="mr-1" src={metro} alt={'metro'} />
          <div className="text-left">
            <h2 className="font-gerbera-h3 text-light-gray-8-text dark:text-dark-gray-8-text">
              {infoData.station}
            </h2>
            <p className="font-gerbera-sub1 text-sm text-light-gray-4 dark:text-dark-gray-4">
              {infoData.address}
            </p>
          </div>
        </div>
        {/* <span className="font-gerbera-sub2 text-sm text-light-gray-2 dark:text-dark-gray-2">
          {infoData.deliveryType}
        </span> */}
      </div>

      {/* Поисковый ввод, отображаемый только по условию */}
      {showSearchInput && (
        <div className="mt-4 bg-light-gray-1 dark:bg-dark-gray-1 rounded-[16px] px-4 py-2 h-[52px] flex items-center">
          <img src={search} className="text-gray-400 w-6 h-6 mr-4" />
          <input
            type="text"
            placeholder={placeholder}
            className="bg-transparent outline-none font-gerbera-sub2 text-light-gray-3 dark:text-dark-gray-4 w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Search;
