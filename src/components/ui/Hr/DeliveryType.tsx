import React, { useState } from 'react';
import arrowRightIcon from '../../../assets/icons/arrow_right.png';
import pencile from '../../../assets/icons/pencile.svg';
import ConfirmModal from '../ConfirmModal/ConfirmModal'; // Импортируем модальное окно

interface IDeliveryTypeProps {
  status: 'Активная' | 'Ближайшая' | 'Завершена';
  points?: number;
  onDeliveryClick: () => void;
}

const DeliveryType: React.FC<IDeliveryTypeProps> = ({
  status,
  points,
  onDeliveryClick,
}) => {
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Управляем состоянием модального окна
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // Отмечаем, был ли отправлен отзыв
  const [routeSheetShown, setRouteSheetShown] = useState(false); // Для отображения маршрутного листа после отправки отзыва
  const [showRouteSheet, setShowRouteSheet] = useState(false); // Управляем видимостью маршрутного листа

  // Обработчик для клика по кнопке, если статус "Завершена"
  const handleCompletedClick = () => {
    if (status === 'Завершена' && !feedbackSubmitted) {
      setShowFeedbackButton(true);
    } else if (feedbackSubmitted) {
      setRouteSheetShown(true); // Показываем маршрутный лист после отправки отзыва
      setShowRouteSheet(true); // Отображаем маршрутный лист
    } else {
      onDeliveryClick();
    }
  };

  const handleFeedbackButtonClick = () => {
    setShowFeedbackButton(false);
    setShowFeedbackForm(true);
  };

  const handleFeedbackSubmit = () => {
    setShowFeedbackForm(false);
    setIsModalOpen(true); // Открываем модальное окно при отправке
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFeedbackSubmitted(true); // Помечаем, что отзыв был отправлен
    setShowRouteSheet(false); // Скрываем маршрутный лист после закрытия модального окна
  };

  // Классы для статуса
  const statusClass =
    status === 'Завершена'
      ? 'btn-S-GreenInactive'
      : 'btn-S-GreenDefault mr-[10px]';

  return (
    <div className="w-[360px] mh-[227px] p-4 bg-light-gray-white rounded-[16px]">
      <div className="flex items-center justify-between space-x-2">
        {/* Показ текущего статуса */}
        <div
          className={`flex items-center justify-center ${statusClass}`}
          style={{ borderRadius: '100px' }}
        >
          {status}
        </div>

        {/* Кнопка для статуса "Активная" или для завершенного маршрутного листа */}
        {(status === 'Активная' ||
          (status === 'Завершена' && showRouteSheet)) && (
          <button
            onClick={onDeliveryClick}
            className="flex items-center space-x-1 text-light-gray-black focus:outline-none"
          >
            <span className="font-gerbera-sub2 text-light-gray-3">
              Доставка
            </span>
            <img
              src={arrowRightIcon}
              alt="arrowRightIcon"
              className="w-4 h-4"
            />
          </button>
        )}

        {/* Кнопка для статуса "Завершена", если форма еще не открыта */}
        {status === 'Завершена' && !showFeedbackForm && !routeSheetShown && (
          <button
            onClick={handleCompletedClick}
            className="flex items-center text-light-gray-black focus:outline-none"
          >
            <span className="font-gerbera-sub2 text-light-gray-3">
              {points ? `+${points} балла` : 'Доставка'}
            </span>
            <img
              src={arrowRightIcon}
              alt="arrowRightIcon"
              className="w-4 h-4"
            />
          </button>
        )}
      </div>

      {/* Показ кнопки "Поделиться впечатлениями", если статус завершен и форма еще не открыта */}
      {status === 'Завершена' && showFeedbackButton && !showFeedbackForm && (
        <div className="mt-4">
          <button
            className="btn-B-GreenDefault focus:outline-none mt-[20px]"
            onClick={handleFeedbackButtonClick}
          >
            Поделиться впечатлениями
          </button>
        </div>
      )}

      {/* Показ формы для комментариев, если кнопка "Поделиться впечатлениями" была нажата */}
      {status === 'Завершена' && showFeedbackForm && (
        <div className="mt-4 bg-white">
          <div className="flex items-center mb-[20px]">
            <img
              src={pencile}
              alt="pencil"
              className="w-[42px] h-[52px] mr-[14px]"
            />
            <h3 className="font-gerbera-h3 text-light-gray-black text-left mb-2">
              Поделитесь вашими впечатлениями от курирования в доставке
            </h3>
          </div>
          <p className="font-gerbera-sub2 text-light-gray-5 text-left mb-[4px]">
            Как прошла доставка? Что понравилось? А что хотели бы изменить и
            как?
          </p>
          <textarea
            className="w-full p-2 bg-light-gray-1 rounded-[16px] h-[58px] mb-4 font-gerbera-h2 text-light-black text-left"
            placeholder=""
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
          <button
            className="btn-B-WhiteClicked bg-light-gray-3 text-light-gray-white font-gerbera-h3"
            onClick={handleFeedbackSubmit}
            disabled={!feedback.trim()}
          >
            Отправить
          </button>
        </div>
      )}
      {/* Модальное окно с подтверждением */}
      <ConfirmModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleModalClose} // Закрытие модального окна по нажатию "Закрыть"
        title="Спасибо, что поделились!"
        description="Это важно."
        confirmText="Закрыть"
        isSingleButton={true} // Только одна кнопка
      />
    </div>
  );
};

export default DeliveryType;
