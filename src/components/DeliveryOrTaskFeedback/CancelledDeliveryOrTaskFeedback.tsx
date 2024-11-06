import { useState, useContext } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';
import { submitFeedbackDeliveryoOrTask, type TFeedbackTypes } from '../../api/feedbackApi';
import { UserContext } from '../../core/UserContext';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';


interface IDeliveryFeedbackProps{
    onOpenChange: (open: boolean) => void
  onSubmitFidback: (e: boolean) => void
  delivery: boolean //// true если это доствка false  если это доброе дело
  deliveryOrTaskId:number
}


const CancelledDeliveryOrTaskFeedback: React.FC<IDeliveryFeedbackProps> = ({onOpenChange, onSubmitFidback, delivery, deliveryOrTaskId}) => {


  const [feedbacks, setFeedbacks] = useState({
    fb1Cancel: localStorage.getItem('fb1Cancel') ?? '',
  });

  const [buttonActive, setButtonActive] = useState(false)
 const [fedbackSendFail, setFedbackSendFail] = useState(false)

  ////// используем контекст
  const userValue = useContext(UserContext);
  const token = userValue.token;
  ////// используем контекст



  type TReasons = keyof typeof feedbacks;
  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TReasons, value: string) {
    setFeedbacks({
      ...feedbacks,
      [fieldName]: value,
    });
    localStorage.setItem(fieldName, value);
  }

  function handleInfoInput() {
    if (feedbacks.fb1Cancel.length > 5) {
      setButtonActive(true)
    } else setButtonActive(false)
  }


  async function handleDeliveryOrTaskCancelledFeedbackSubmit(deliveryId: number) {
      let fedbackText: string;
      let type:TFeedbackTypes
      if (delivery) {
      type="canceled_delivery"
      fedbackText = `Поделитесь, пожалуйста, почему вы отказались от участия в доставке? Ответ: ${feedbacks.fb1Cancel}`
      } else {
        type="canceled_promotion"
      fedbackText = `Поделитесь, пожалуйста, почему вы отказались от участия в добром деле? Ответ: ${feedbacks.fb1Cancel}`
    }
    
    if (token) {
      try {
        const response = await submitFeedbackDeliveryoOrTask(token, delivery, type, fedbackText, deliveryId)
        if (response) {
        feedbacks.fb1Cancel = "";
        localStorage.removeItem("fb1Cancel");
        onOpenChange(false)
        onSubmitFidback(true)
        }
      } catch (err) {
        setFedbackSendFail(true)
        console.log(err, "handleFormSubmit deliveryFeedback")
      }
    } else {
      setFedbackSendFail(true)
    }
 
  }

  return (
    <>
      <div className="w-[360px] flex flex-col rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo"
      onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center self-start mt-[25px] mx-4">
          <img
            src="../src/assets/icons/big_pencil.svg"
            className="h-[32px] w-[32px]"
          />

          {delivery ? (
         <p className="ml-[14px] font-gerbera-h3 dark:text-light-gray-1">
         Поделитесь, пожалуйста, почему вы отказались от участия в доставке?
         </p>
         ) : (<p className="ml-[14px] font-gerbera-h3 dark:text-light-gray-1">
          Поделитесь, пожалуйста, почему вы отказались от участия в добром деле?
          </p>)}
        </div>

        <Form.Root
           className=" flex flex-col items-center justify-center"
          onSubmit={e => {
            e.preventDefault();
            handleDeliveryOrTaskCancelledFeedbackSubmit(deliveryOrTaskId)
          }}
         >
          <div  className='flex flex-col px-4'>
            <Form.Field name="fb1" className="mt-4">
            <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray">Расскажите в свободной форме</Form.Label>
              {/* <Form.Label className="font-gerbera-sub2 text-light-gray-4">
              Поделитесь, пожалуйста, почему вы отказались от участия в доставке
              </Form.Label> */}
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                placeholder:text-light-gray-3 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('fb1Cancel') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('fb1Cancel', e.target.value);
                    handleInfoInput()
                  }}
                />
              </Form.Control>
              <Form.Message
                match={(value) => value.length < 10}
                className="font-gerbera-sub2 text-light-error-red line-clamp-3"
              >
                Сообщение слишком короткое, минимальное количество символов 10
              </Form.Message>
            </Form.Field>
          </div>
          <button className={`${buttonActive ? "btn-B-GreenDefault" : "btn-B-GreenInactive dark:bg-light-gray-5 dark:text-light-gray-4"} mt-4 mb-4 `}
            onClick={(e) => {
              if (buttonActive) {
               
              }else e.preventDefault()
          }}
          >Отправить</button>
        </Form.Root>
      </div>
        <ConfirmModal
        isOpen={fedbackSendFail}
        onOpenChange={setFedbackSendFail}
        onConfirm={() => {setFedbackSendFail(false);}}
        title={"Упс, что-то пошло не так"}
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />
    </>
  );
};

export default CancelledDeliveryOrTaskFeedback;
