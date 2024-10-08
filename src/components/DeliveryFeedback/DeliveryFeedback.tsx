import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';

interface IDeliveryFeedbackProps{
  onOpenChange: (open: boolean) => void
  onSubmitFidback: (e:boolean) => void
}


const DeliveryFeedback: React.FC<IDeliveryFeedbackProps> = ({onOpenChange, onSubmitFidback}) => {


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
      <div className="w-[360px] flex flex-col rounded-t-2xl bg-light-gray-white"
      onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center self-start mt-[25px] mx-4">
          <img
            src="../src/assets/icons/big_pencil.svg"
            className="h-[32px] w-[32px]"
          />
          <p className="ml-[14px] font-gerbera-h3">
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
                  className="w-[328px] bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0
                placeholder:text-light-gray-3"
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
              <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 ">Как прошла доставка? что вам понравилось? что вы бы поменяли?</Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0
                 placeholder:text-light-gray-3 mb-2 "
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
          <button className={`${buttonActive ? "btn-B-GreenDefault" : "btn-B-GreenInactive"} mt-4 mb-4  `}
            onClick={(e) => {
              if (buttonActive) {
               
              }else e.preventDefault()
          }}
          >Завершить</button>
        </Form.Root>
      </div>
    </>
  );
};

export default DeliveryFeedback;
