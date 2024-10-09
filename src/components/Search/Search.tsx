import React, { useState, useEffect } from 'react';
import searchIcon from '../../assets/icons/search.svg';
import metroIcon from '../../assets/icons/metro_station.svg';

interface ISearchProps {
  placeholder?: string;
  showSearchInput?: boolean;
  showInfoSection?: boolean;
  curators: ICurator[];
  onVolunteerClick: (volunteer: ICurator) => void;
}

interface ICurator {
  name: string;
  avatar: string;
  role: 'curator' | 'volunteer'; // Добавляем роль волонтера
}

const Search: React.FC<ISearchProps> = ({
  placeholder = 'Поиск по ФИО',
  showSearchInput = true,
  showInfoSection = true,
  curators,
  onVolunteerClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurators, setFilteredCurators] = useState<ICurator[]>([]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const results = curators.filter(curator =>
        curator.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCurators(results);
    } else {
      setFilteredCurators([]);
    }
  }, [searchQuery, curators]);

  const infoData = {
    station: 'Ст. Молодежная',
    address: 'Мск, ул. Бобруйская д.6 к.2',
  };

  return (
    <div className="bg-light-gray-white dark:bg-dark-gray-white p-4 rounded-[16px] max-w-md w-[360px]">
      {showInfoSection && (
        <div className="flex justify-between items-center">
          <div className="flex">
            <img className="mr-1" src={metroIcon} alt={'metro'} />
            <div className="text-left">
              <h2 className="font-gerbera-h3 text-light-gray-8-text dark:text-dark-gray-8-text">
                {infoData.station}
              </h2>
              <p className="font-gerbera-sub1 text-sm text-light-gray-4 dark:text-dark-gray-4">
                {infoData.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {showSearchInput && (
        <div className="mt-4 bg-light-gray-1 dark:bg-dark-gray-1 rounded-[16px] px-4 py-2 h-[52px] flex items-center">
          <img src={searchIcon} className="text-gray-400 w-6 h-6 mr-4" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none font-gerbera-sub2 text-light-gray-3 dark:text-dark-gray-4 w-full"
          />
        </div>
      )}

      {filteredCurators.length > 0 && (
        <div className="mt-4 space-y-2">
          {filteredCurators.map((curator, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-2 bg-light-gray-1 rounded-[16px] shadow cursor-pointer"
              onClick={() => onVolunteerClick(curator)}
            >
              <img
                src={curator.avatar}
                alt={curator.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-gerbera-h3 text-light-gray-8-text">
                {curator.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
