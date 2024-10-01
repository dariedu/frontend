import React from 'react';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';
import curatorIcon from '../../assets/icons/application_curator.svg';
import historyIcon from '../../assets/icons/history.svg';
import questionsIcon from '../../assets/icons/questions.svg';
import donateIcon from '../../assets/icons/donate.svg';
import inviteIcon from '../../assets/icons/invite_friend.svg';
import beneficiaryIcon from '../../assets/icons/beneficiary.svg';

// Тип для действия
interface IAction {
  label: string;
  icon: string | JSX.Element;
  link: string;
  points?: string;
}

// Типы пропсов
interface IActionsVolunteerProps {
  visibleActions: string[]; // Список видимых действий по их label
  showThemeToggle: boolean; // Показывать переключатель темы или нет
}

const ActionsVolunteer: React.FC<IActionsVolunteerProps> = ({
  visibleActions,
  showThemeToggle,
}) => {
  // Все действия
  const actions: IAction[] = [
    {
      label: 'Подать заявку на должность куратора',
      icon: curatorIcon,
      link: '#',
    },
    { label: 'История', icon: historyIcon, link: '#' },
    { label: 'Вопросы и предложения', icon: questionsIcon, link: '#' },
    { label: 'Помочь деньгами', icon: donateIcon, link: '#' },
    {
      label: 'Пригласить друга',
      icon: inviteIcon,
      link: '#',
      points: '+3 балла',
    },
    { label: 'Предложить благополучателя', icon: beneficiaryIcon, link: '#' },
  ];

  // Фильтруем действия для отображения
  const filteredActions = actions.filter(action =>
    visibleActions.includes(action.label),
  );

  return (
    <div className="space-y-4 bg-gray-100 rounded-[16px] w-[360px]">
      {/* Theme toggle switch */}
      {showThemeToggle && (
        <div className="flex items-center justify-between p-4 bg-white rounded-[16px] shadow h-[66px]">
          <ThemeToggle />
        </div>
      )}

      {/* Action items */}
      {filteredActions.map((action, index) => (
        <a
          key={index}
          href={action.link}
          className="flex items-center justify-between p-4 bg-white rounded-[16px] shadow hover:bg-gray-50 h-[66px]"
        >
          <div className="flex items-center space-x-4">
            {/* Check if icon is a string path (SVG), render as <img> */}
            {typeof action.icon === 'string' && action.icon.endsWith('.svg') ? (
              <img
                src={action.icon}
                alt={action.label}
                className="w-[42px] h-[42px]" // Control the size of SVG
              />
            ) : (
              // Render emoji or other text-based icons
              <span>{action.icon}</span>
            )}
            <span className="font-gerbera-h3 text-light-gray-black m-0">
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
