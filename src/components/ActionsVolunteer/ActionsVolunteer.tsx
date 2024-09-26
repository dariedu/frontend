import React from 'react';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';

const ActionsVolunteer: React.FC = () => {
  // Mock action items
  const actions = [
    { label: 'Подать заявку на должность куратора', icon: '👤', link: '#' },
    { label: 'История', icon: '🕰️', link: '#' },
    { label: 'Вопросы и предложения', icon: '❓', link: '#' },
    { label: 'Помочь деньгами', icon: '💰', link: '#' },
    { label: 'Пригласить друга', icon: '🎁', link: '#', points: '+3 балла' },
    { label: 'Предложить благополучателя', icon: '📦', link: '#' },
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-lg w-[360px]">
      {/* Theme toggle switch */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <ThemeToggle />
      </div>

      {/* Action items */}
      {actions.map((action, index) => (
        <a
          key={index}
          href={action.link}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50"
        >
          <div className="flex items-center space-x-4">
            <span>{action.icon}</span>
            <span className="text-black">{action.label}</span>
          </div>
          {action.points && (
            <span className="text-green-500">{action.points}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default ActionsVolunteer;
