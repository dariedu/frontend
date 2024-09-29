import React from 'react';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <div className="bg-white shadow-md rounded-[16px] w-[360px] p-4 flex justify-center items-center space-x-2">
      {/* Status Indicator */}
      <div className="w-2.5 h-2.5 bg-light-brand-green rounded-full" />

      {/* Notification Message */}
      <span className="font-gerbera-sub2 text-gray-8-text text-sm">
        {message}
      </span>
    </div>
  );
};

export default Notification;
