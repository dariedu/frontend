import React from 'react';

interface InputDateProps {
  onClose: () => void; // Пропс для закрытия
}

const InputDate: React.FC<InputDateProps> = ({ onClose }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-[360px]">
      <h2 className="font-gerbera-h1 text-lg mb-4">Выбор даты</h2>
      {/* Ваш контент для выбора даты */}
      <div>{/* Тут будет выбор даты */}</div>
      <div className="flex justify-end mt-4">
        <button className="text-light-brand-green" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default InputDate;
