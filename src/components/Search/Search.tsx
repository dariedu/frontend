import React, { useState, useEffect } from 'react';
import searchIcon from '../../assets/icons/search.svg';
import metroIcon from '../../assets/icons/metro_station.svg';
import { IUser } from '../../core/types';

interface ISearchProps {
  placeholder?: string;
  showSearchInput?: boolean;
  showInfoSection?: boolean;
  users: IUser[];
  onUserClick: (user: IUser) => void;
  station?: string; // Новый пропс для станции метро
  address?: string; // Новый пропс для адреса
}

const Search: React.FC<ISearchProps> = ({
  placeholder = 'Поиск по ФИО',
  showSearchInput = true,
  showInfoSection = true,
  users,
  onUserClick,
  station = 'Станция не указана', // Установка значений по умолчанию
  address = 'Адрес не указан',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const results = users.filter(user =>
        (user.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

  return (
    <div className="bg-light-gray-white dark:bg-dark-gray-white p-4 rounded-[16px] max-w-md w-[360px]">
      {showInfoSection && (
        <div className="flex justify-between items-center">
          <div className="flex">
            <img className="mr-1" src={metroIcon} alt="metro" />
            <div className="text-left">
              <h2 className="font-gerbera-h3 text-light-gray-8-text dark:text-dark-gray-8-text">
                {station}
              </h2>
              <p className="font-gerbera-sub1 text-sm text-light-gray-4 dark:text-dark-gray-4">
                {address}
              </p>
            </div>
          </div>
        </div>
      )}

      {showSearchInput && (
        <div className="mt-4 bg-light-gray-1 dark:bg-dark-gray-1 rounded-[16px] px-4 py-2 h-[52px] flex items-center">
          <img
            src={searchIcon}
            className="text-gray-400 w-6 h-6 mr-4"
            alt="search"
          />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none font-gerbera-sub2 text-light-gray-3 dark:text-dark-gray-4 w-full"
          />
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="mt-4 space-y-2">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center space-x-4 p-2 bg-light-gray-1 rounded-[16px] shadow cursor-pointer"
              onClick={() => onUserClick(user)}
            >
              <img
                src={user.avatar}
                alt={user.name ?? 'аватар'}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-gerbera-h3 text-light-gray-8-text">
                {user.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
