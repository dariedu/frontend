import React, { useState, useContext } from 'react';
import { getMonthCorrectEndingName,   getVolunteerCorrectEndingName,
} from '../helperFunctions/helperFunctions';
 import RouteSheets from '../RouteSheets/RouteSheets';
import DeliveryFeedback from '../DeliveryFeedback/DeliveryFeedback';
import { Modal } from '../ui/Modal/Modal';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import { type IDelivery } from '../../api/apiDeliveries';
import { DeliveryContext } from '../../core/DeliveryContext';


interface INearestDeliveryProps {
  delivery: IDelivery;
  deliveryFilter?: TDeliveryFilter;
}

type TDeliveryFilter = 'nearest' | 'active' | 'completed';

const NearestDeliveryCurator: React.FC<INearestDeliveryProps> = ({
  delivery,
  deliveryFilter = 'nearest',
}) => {
  const deliveryDate = new Date(delivery.date);

  const [fullViewCompleted, setFullViewCompleted] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали
  const [fullViewActive, setFullViewActive] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали
  const [fullViewNearest, setFullViewNearest] = useState(false); //// раскрываем завершенную доставку, чтобы увидеть детали


  const [currentStatus, setCurrentStatus] =  useState<TDeliveryFilter>(deliveryFilter); /// статус доставки 'nearest' | 'active' | 'completed'
  const [isCuratorFeedbackModalOpen, setIsCuratorFeedbackModalOpen] =  useState(false); /// открываем модальное окно с отзывом по завершенной доставке куратора
  const [isFeedbackSubmitedModalOpen, setIsFeedbackSubmitedModalOpen] =  useState(false); ////// открываем модальное окно, чтобы подтвердить доставку

  const { deliveries, isLoading } = useContext(DeliveryContext); // Данные из контекста
  delivery = deliveries[0];

  if (isLoading) return <div>Loading</div>;


///////////////////////////
  function onSelectVolunteer(
    volunteerName: string,
    volunteerAvatar: string,
  ): void {
    console.log(volunteerName + ' ' + volunteerAvatar);
  }
////////////////////////


  return (<>
      <div className={`${fullViewActive == true ? 'hidden ' : ' '} w-[362px] py-[17px] px-4 h-fit rounded-2xl flex flex-col mt-1 bg-light-gray-white dark:bg-light-gray-7-logo`}>
      <div className="flex justify-between w-full">
        
        {/* //////// */}
          {currentStatus == 'nearest' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Ближайшая
            </p>
          ) : currentStatus == 'active' ? (
            <p className="btn-S-GreenDefault flex items-center justify-center">
              Активная
            </p>
          ) : currentStatus == 'completed' ? (
            <p className="btn-S-GreenInactive flex items-center justify-center">
              Завершённая
            </p>
          ) : (
            ''
        )}
        {/* ////////// */}
          <div className="flex items-center">
            <p
              className={'font-gerbera-sub2 text-light-gray-3 dark:text-light-gray-4 mr-2'}>Доставка{' '}</p>
        
              {currentStatus == 'active' ? (
              <img
                src="../src/assets/icons/arrow_right.png"
                className="cursor-pointer"
                onClick={() => {setFullViewActive(true)}}
              />
            ) : currentStatus == 'completed' ? (
              <img
                src="../src/assets/icons/arrow_down.png"
                className={`${!fullViewCompleted ? 'rotate-180' : ''} cursor-pointer`}
                onClick={() => {
                  fullViewCompleted == true
                    ? setFullViewCompleted(false)
                    : setFullViewCompleted(true);
                }}
              />
            ) : "" }
          </div>
        </div>
        {/* /////////////////////// */}
      {currentStatus == 'nearest' ? (
        <>
          <div className="flex justify-between items-center mt-[20px]">
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px] dark:bg-light-gray-6">
              <p className="font-gerbera-sub2 text-light-gray-5 ">
                Время начала
              </p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {`${deliveryDate.getDate()}
                  ${getMonthCorrectEndingName(deliveryDate)} в
                  ${deliveryDate.getHours() < 10 ? '0' + deliveryDate.getHours() : deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' + deliveryDate.getMinutes() : deliveryDate.getMinutes()}`}
              </p>
            </div>
            <div className="bg-light-gray-1 rounded-2xl flex flex-col justify-between items-start w-[161px] h-[62px] p-[12px]">
              <p className="font-gerbera-sub2 text-light-gray-5">Записались</p>
              <p className="font-gerbera-h3 text-light-gray-8">
                {delivery.volunteers_taken == 0
                  ? '0 из' + `${delivery.volunteers_needed}`
                  : `${delivery.volunteers_taken + ' из ' + `${delivery.volunteers_needed}` + ' ' + getVolunteerCorrectEndingName(delivery.volunteers_needed)}`}
              </p>
          </div> 
          </div>
           <button className="btn-B-WhiteDefault mt-[20px]"
              onClick={() => setFullViewNearest(true)}
            >
              Список записавшихся волонтёров
            </button>
        </>
      ) : ('')}
        {currentStatus == 'completed' && fullViewCompleted ? (
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
          ) }

        {/* /////////////////////// */}
    </div>
    {<Modal isOpen={fullViewActive} onOpenChange={setFullViewActive}>
      <RouteSheets
            status="Активная"
            onClose={() => setFullViewActive(false)}
            onStatusChange={() => {
              return setCurrentStatus('completed');
            }}
            routeSheetsData={[]}
            completedRouteSheets={[]}
            setCompletedRouteSheets={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
    </Modal>}
      <Modal
        isOpen={isCuratorFeedbackModalOpen}
        onOpenChange={setIsCuratorFeedbackModalOpen}
      >
        <DeliveryFeedback
          onOpenChange={setIsCuratorFeedbackModalOpen}
          onSubmitFidback={() => setIsFeedbackSubmitedModalOpen(true)}
          volunteer={false}
          delivery={true}
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
    
      {/* ///// раскрываем полные детали активной доставуи для куратора///// */}
      {currentStatus == 'nearest' ? (
        <Modal isOpen={fullViewNearest} onOpenChange={setFullViewNearest}>
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

export default NearestDeliveryCurator;
