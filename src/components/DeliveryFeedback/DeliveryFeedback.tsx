import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';

interface IDeliveryFeedbackProps{
  onOpenChange: (open: boolean) => void
  onSubmitFidback: (e: boolean) => void
  volunteer: boolean
  delivery: boolean //// true если это доствка false  если это доброе дело
}


const DeliveryFeedback: React.FC<IDeliveryFeedbackProps> = ({onOpenChange, onSubmitFidback, volunteer, delivery}) => {


  const [feedbacks, setFeedbacks] = useState({
    fb1: localStorage.getItem('fb1') ?? '',
    fb2: localStorage.getItem('fb2') ?? '',
  });

  const [buttonActive, setButtonActive] = useState(false)

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
    if (feedbacks.fb1.length > 5 || feedbacks.fb2.length > 5) {
      setButtonActive(true)
    } else setButtonActive(false)
  }

  function handleFormSubmit() {
    console.log('submited');
    feedbacks.fb1 = "";
    feedbacks.fb2 = "";
    localStorage.removeItem("fb1");
    localStorage.removeItem("fb2");
    onOpenChange(false)
    onSubmitFidback(true)
  }

  return (
    <>
      {volunteer ? (
      <div className="w-[360px] flex flex-col rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo"
      onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center self-start mt-[25px] mx-4">
          <img
            src="../src/assets/icons/big_pencil.svg"
            className="h-[32px] w-[32px]"
          />
          <p className="ml-[14px] font-gerbera-h3 dark:text-light-gray-1">
            Расскажите, в свободной форме
          </p>
        </div>

        <Form.Root
           className=" flex flex-col items-center justify-center"
          onSubmit={e => {
            e.preventDefault();
            handleFormSubmit()
          }}
         >
          <div  className='flex flex-col px-4'>
            <Form.Field name="fb1" className="mt-4">
              <Form.Label className="font-gerbera-sub2 text-light-gray-4">
                На сколько приятным было общение с куратором?
              </Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                placeholder:text-light-gray-3 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('fb1') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('fb1', e.target.value);
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
              <Form.Field name="fb2" className="mt-4">
                {delivery ? (
                <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray">Как прошла доставка? что вам понравилось? что вы бы поменяли?</Form.Label>
                ): (
                  <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3  dark:text-light-gray">Как прошло ваше учачтие в добром деле? что вам понравилось? что вы бы поменяли?</Form.Label>   
                )
                 }
              
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                 placeholder:text-light-gray-3 mb-2 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  defaultValue={localStorage.getItem('fb2') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('fb2', e.target.value);
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
      ) : (
        <div className="w-[360px] flex flex-col rounded-t-2xl bg-light-gray-white"
        onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center self-start mt-[25px] mx-4">
            <img
              src="../src/assets/icons/big_pencil.svg"
              className="h-[32px] w-[32px]"
            />
              {delivery ? (
            <p className="ml-[14px] font-gerbera-h3 dark:text-light-gray">
            Поделитесь вашими впечатлениями от курирования доставки
            </p>
              ) : (
                <p className="ml-[14px] font-gerbera-h3 dark:text-light-gray">
                Поделитесь вашими впечатлениями от курирования доброго дела
                </p>
            )}
          </div>
  
          <Form.Root
             className=" flex flex-col items-center justify-center"
            onSubmit={e => {
              e.preventDefault();
              handleFormSubmit()
            }}
           >
            <div  className='flex flex-col px-4'>
              <Form.Field name="fb1" className="mt-4">
                  {delivery ? (
                  <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray">
                  Как прошла доставка? Что понравилось? А что хотели бы изменить и как?
                  </Form.Label>
                  ): (
                    <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray-3">
                Как прошло доброе дело? Что понравилось? А что хотели бы изменить и как?
                </Form.Label>
                )}
                <Form.Control asChild>
                  <TextareaAutosize
                    maxRows={10}
                    className="w-[328px] bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                  placeholder:text-light-gray-3 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                    required
                    defaultValue={localStorage.getItem('fb1') ?? ''}
                    onChange={e => {
                      handleFormFieldChange('fb1', e.target.value);
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
                  {/* <Form.Message
                  match="valueMissing"
                  className="font-gerbera-sub2 text-light-error-red line-clamp-3"
                >
                  Для отправки отзыва введите ваше сообщение
                </Form.Message> */}
              </Form.Field>
             
            </div>
            <button className={`${buttonActive ? "btn-B-GreenDefault" : "btn-B-GreenInactive"} mt-4 mb-4  `}
              onClick={(e) => {
                if (buttonActive) {
                 
                }else e.preventDefault()
            }}
            >Отправить</button>
          </Form.Root>
        </div>)}
      
    </>
  );
};

export default DeliveryFeedback;
