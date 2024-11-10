import React from 'react';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';
import CuratorIcon from '../../assets/icons/application_curator.svg?react';
import HistoryIcon from '../../assets/icons/history.svg?react';
import QuestionsIcon from '../../assets/icons/questions.svg?react';
import DonateIcon from '../../assets/icons/donate.svg?react';
import InviteIcon from '../../assets/icons/invite_friend.svg?react';
import BeneficiaryIcon from '../../assets/icons/beneficiary.svg?react';
import AboutIcon from '../../assets/icons/about.svg?react';
import { getBallCorrectEndingName } from '../helperFunctions/helperFunctions';

interface IAction {
  label: string;
  icon: string | JSX.Element;
  link: string;
  points?: string;
}

interface IActionsVolunteerProps {
  visibleActions: string[];
  showThemeToggle: boolean;
}

const ActionsVolunteer: React.FC<IActionsVolunteerProps> = ({
  visibleActions,
  showThemeToggle,
}) => {
  // Все действия
  const actions: IAction[] = [
    {
      label: 'Подать заявку на должность куратора',
      icon: <CuratorIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>,
      link: '#',
    },
    { label: 'История', icon: <HistoryIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' />, link: '#' },
    { label: 'Обо мне', icon: <AboutIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>, link: '#' },
    {
      label: 'Пригласить друга',
      icon: <InviteIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>,
      link: '#',
      points: `+3 ${getBallCorrectEndingName(3)} `,
    },
    // {
    //   label: 'Подать заявку на должность куратора',
    //   icon: <CuratorIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' />,
    //   link: '#',
    // },
    { label: 'Знаю того, кому нужна помощь', icon: <BeneficiaryIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' /> , link: '#' },
    { label: 'Сделать пожертвование', icon: <DonateIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' />, link: '#' },
    { label: 'Вопросы и предложения', icon: <QuestionsIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>, link: '#' },
  ];

  // Фильтруем действия для отображения
  const filteredActions = actions.filter(action =>
    visibleActions.includes(action.label),
  );

  return (
    <div className="space-y-[4px] bg-light-gray-1 dark:bg-light-gray-black rounded-[16px] w-[360px] mt-1">
      {/* Переключение темы */}
      {showThemeToggle && (
        <div className="relative bg-light-gray-1 rounded-[16px]">
          <div className="flex items-center justify-between p-4 bg-light-gray-white shadow h-[66px] rounded-[16px] dark:bg-light-gray-7-logo">
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Действия */}
      {filteredActions.map((action, index) => (
        <a
          key={index}
          href={action.link}
          className="flex items-center justify-between p-4 bg-light-gray-white dark:bg-light-gray-7-logo rounded-[16px] shadow  h-[66px]"
        >
          <div className="flex items-center space-x-4">
            {typeof action.icon === 'string' && action.icon.endsWith('.svg') ? (
              <span>{action.icon}</span>
              // <img
              //   src={}
              //   alt={action.label}
              //   className="w-[42px] h-[42px]"
              // />
            ) : (
              <span>{action.icon}</span>
            )}
            <span className="font-gerbera-h3 text-light-gray-black m-0 dark:text-light-gray-1">
              {action.label}
            </span>
          </div>
          {action.points && (
            <span className="font-gerbera-sub2 text-light-brand-green w-[129px]">
              {action.points}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

export default ActionsVolunteer;
