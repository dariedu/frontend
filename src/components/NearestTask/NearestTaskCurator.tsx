import React, { useState } from 'react';
import {
  getMonthCorrectEndingName,
  getVolunteerCorrectEndingName,
} from '../helperFunctions/helperFunctions';
import CompletedDeliveryOrTaskFeedback from '../DeliveryOrTaskFeedback/CompletedDeliveryOrTaskFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
//import RouteSheets from '../RouteSheets/RouteSheets';
import { type ITask } from '../../api/apiTasks';

interface INearestTaskProps {
  task: ITask;
  //volunteer: boolean;
  taskFilter?: TTaskFilter;
}

type TTaskFilter = 'nearest' | 'active' | 'completed';

const NearestTaskCurator: React.FC<INearestTaskProps> = ({
  task,
  taskFilter,
}) => {
  const taskDate = new Date(task.start_date);

  const [fullViewCurator, setFullViewCurator] = useState(false);
  // const [currentStatus, setCurrentStatus] = useState<TTaskFilter>(taskFilter); /// статус доставки 'nearest' | 'active' | 'completed'
  // const [isModalOpen, setIsModalOpen] = useState(false); /// открываем модальное окно с отзывом по завершенной доставке волонтера
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] =
    useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =
    useState(false); ////// открываем модальное окно, чтобы подтвердить доставку

  const [isCancelDeliveryModalOpen, setIsCancelDeliveryModalOpen] =
    useState(false); //// модальное окно для отмены доставки
  const [isDeliveryCancelledModalOpen, setIsDeliveryCancelledModalOpen] =
    useState(false); //// модальное окно для подтверждения отмены доставки

  function onSelectVolunteer(
    volunteerName: string,
    volunteerAvatar: string,
  ): void {
    console.log(volunteerName + ' ' + volunteerAvatar);
  }
  return (
    <>
      <div
        className={`${taskFilter == 'active' ? (fullViewCurator == true ? 'hidden' : '') : ''} w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}
      >
        <div className="flex justify-between w-full">
          {taskFilter == 'nearest' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Ближайшее
            </p>
          ) : taskFilter == 'active' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Активное
            </p>
          ) : taskFilter == 'completed' ? (
            <p className="btn-S-GreenInactive flex items-center justify-center">
              Завершённое
            </p>
          ) : (
            ''
          )}

          <div className="flex items-center">
            <p
              className={
                taskFilter == 'nearest'
                  ? 'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2'
                  : 'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2 cursor-pointer'
              }
              onClick={() => {
                taskFilter == 'nearest'
                  ? ''
                  : fullViewCurator == true
                    ? setFullViewCurator(false)
                    : setFullViewCurator(true);
              }}
            >
              {task.category.name}{' '}
            </p>
            {taskFilter == 'active' ? (
              <img
                src="../src/assets/icons/arrow_right.png"
                className=" cursor-pointer"
                onClick={() => {
                  fullViewCurator == true
                    ? setFullViewCurator(false)
                    : setFullViewCurator(true);
                }}
              />
            ) : taskFilter == 'completed' ? (
              <img
                src="../src/assets/icons/arrow_down.png"
                className={`${!fullViewCurator ? 'rotate-180' : ''} cursor-pointer`}
                onClick={() => {
                  fullViewCurator == true
                    ? setFullViewCurator(false)
                    : setFullViewCurator(true);
                }}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        {/* /////////////////////// */}
        {taskFilter == 'active' ? (
          ''
        ) : taskFilter == 'nearest' ? (
          <div className="flex justify-between items-center mt-[20px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-5 ">
                Время начала
              </p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {`${taskDate.getDate()}
                  ${getMonthCorrectEndingName(taskDate)} в
                  ${taskDate.getHours() < 10 ? '0' + taskDate.getHours() : taskDate.getHours()}:${taskDate.getMinutes() < 10 ? '0' + taskDate.getMinutes() : taskDate.getMinutes()}`}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-5">Записались</p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {task.volunteers_taken == 0
                  ? '0 из' + `${task.volunteers_needed}`
                  : `${task.volunteers_taken + ' из ' + `${task.volunteers_needed}` + ' ' + getVolunteerCorrectEndingName(task.volunteers_needed)}`}
              </p>
            </div>
          </div>
        ) : (
          ''
        )}
        {taskFilter == 'active' || taskFilter == 'completed' ? (
          ''
        ) : (
          <button
            className="btn-B-WhiteDefault mt-[20px]"
            onClick={() => setFullViewCurator(true)}
          >
            Список записавшихся волонтёров
          </button>
        )}
        {taskFilter == 'completed' && fullViewCurator ? (
          <button
            className="btn-B-GreenDefault  mt-[20px]"
            onClick={e => {
              e.preventDefault();
              setIsCuratorFeedbackModalOpen(true);
            }}
          >
            Поделиться впечатлениями
          </button>
        ) : (
          ''
        )}
        {/* /////////////////////// */}
      </div>
      <Modal
        isOpen={isCuratorFeedbackModalOpen}
        onOpenChange={setIsCuratorFeedbackModalOpen}
      >
        <CompletedDeliveryOrTaskFeedback
          onOpenChange={setIsCuratorFeedbackModalOpen}
          onSubmitFidback={setIsFeedbackSubmitedModalOpen}
          volunteer={false}
          delivery={false}
          deliveryOrTaskId={task.id}
        />
      </Modal>
      <ConfirmModal
        isOpen={isFeedbackSubmitedModalOpen}
        onOpenChange={setIsFeedbackSubmitedModalOpen}
        onConfirm={() => setIsFeedbackSubmitedModalOpen(false)}
        title={
          <p>
            Спасибо, что поделились!
            <br /> Это важно.
          </p>
        }
        description=""
        confirmText="Закрыть"
        isSingleButton={true}
      />
      <ConfirmModal
        isOpen={isCancelDeliveryModalOpen}
        onOpenChange={setIsCancelDeliveryModalOpen}
        onConfirm={() => {
          setIsDeliveryCancelledModalOpen(true);
          setIsCancelDeliveryModalOpen(false);
        }}
        title={<p>Уверены, что хотите отменить участие?</p>}
        description=""
        confirmText="Да"
        cancelText="Нет"
      />
      <ConfirmModal
        isOpen={isDeliveryCancelledModalOpen}
        onOpenChange={setIsDeliveryCancelledModalOpen}
        onConfirm={() => setIsDeliveryCancelledModalOpen(false)}
        title="Участие отменено"
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
      {/* ///// раскрываем полные детали активной доставуи для куратора///// */}
      {taskFilter == 'nearest' || taskFilter == 'active' ? (
        <Modal isOpen={fullViewCurator} onOpenChange={setFullViewCurator}>
          <ListOfVolunteers
            onSelectVolunteer={onSelectVolunteer}
            onTakeRoute={() => {}}
            showActions={true}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </Modal>
      ) : (
        ''
      )}
    </>
  );
};

export default NearestTaskCurator;
