import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import avatar1 from '../../assets/avatar.svg';

interface IVolunteer {
  volunteerName: string;
  avatar: string;
}

const volunteers: IVolunteer[] = [
  { volunteerName: 'Осипова Юлия', avatar: avatar1 },
  { volunteerName: 'Иванов Иван', avatar: avatar1 },
  { volunteerName: 'Сидоров Алексей', avatar: avatar1 },
  { volunteerName: 'Смирнова Анна', avatar: avatar1 },
  { volunteerName: 'Петров Петр', avatar: avatar1 },
  { volunteerName: 'Александрова Мария', avatar: avatar1 },
];

const ListOfVolunteers: React.FC = () => {
  const [isClickedLeft, setIsClickedLeft] = React.useState(false);
  const [isClickedRight, setIsClickedRight] = React.useState(false);

  const handleClickLeft = () => {
    setIsClickedLeft(true);
  };

  const handleClickRight = () => {
    setIsClickedRight(true);
  };

  return (
    <div className="space-y-4 bg-light-gray-white rounded-[16px] w-[360px] p-4">
      {/* Список волонтёров */}
      {volunteers.map((volunteer, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-light-gray-1 rounded-[16px] shadow"
        >
          {/* Аватарка */}
          <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-8 h-8 rounded-full bg-gray-300">
            <Avatar.Image
              className="w-full h-full object-cover"
              src={volunteer.avatar}
              alt={volunteer.volunteerName}
            />
            <Avatar.Fallback
              className="w-full h-full flex items-center justify-center text-white bg-black"
              delayMs={600}
            >
              {volunteer.volunteerName.charAt(0)}
            </Avatar.Fallback>
          </Avatar.Root>
          {/* Имя волонтера */}
          <span className="font-gerbera-h3 text-light-gray-8-text">
            {volunteer.volunteerName}
          </span>
        </div>
      ))}

      {/* Действия кнопок */}
      <div className="flex justify-between mt-4">
        <button
          className={`btn-M-GreenDefault ${isClickedLeft ? 'btn-M-GreenClicked' : ''}`}
          onClick={handleClickLeft}
        >
          Написать координатору
        </button>
        <button
          className={`btn-M-WhiteDefault ${isClickedRight ? 'btn-M-WhiteClicked' : ''}`}
          onClick={handleClickRight}
        >
          Забрать себе
        </button>
      </div>
    </div>
  );
};

export default ListOfVolunteers;
