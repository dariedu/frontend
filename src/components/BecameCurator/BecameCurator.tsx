import { useState, useContext } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';
import Big_pencil from './../../assets/icons/big_pencil.svg?react'
import { TokenContext } from '../../core/TokenContext';
import { createRequestMessage, type TRequestMessageRequest } from '../../api/requestMessageApi';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';

const BecameCurator = () => {

  const [requestBody, setRequestBody] = useState({
    about_location: localStorage.getItem('about_location') ?? '',
    about_presence: localStorage.getItem('about_presence') ?? '',
    about_worktime: localStorage.getItem('about_worktime') ?? '',
  });

  type TReasons = keyof typeof requestBody;


  const [buttonActive, setButtonActive] = useState(false)
  const [requestBecameCuratorFail, setRequestBecameCuratorFail] = useState(false)
  const [requestBecameCuratorSuccess, setRequestBecameCuratorSuccess] = useState(false)
  //const [requestSent, setRequestSent] = useState(false);

    ////// используем контекст
    const tokenContext = useContext(TokenContext);
    const token = tokenContext.token;;
  ////// используем контекст
  

  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TReasons, value: string) {
    setRequestBody({
      ...requestBody,
      [fieldName]: value,
    });
    localStorage.setItem(fieldName, value);
  }

  async function handleRequestSubmit() {

    const requestObject:TRequestMessageRequest = {
      type: "Заявка на кураторство",
      about_location: requestBody.about_location,
      about_presence: requestBody.about_presence,
      about_worktime: requestBody.about_worktime
 }
  
    if (token) {
      try {
        const response = await createRequestMessage(token, requestObject)
        if (response) {
          requestBody.about_location = "";
          requestBody.about_presence = "";
          requestBody.about_worktime = "";
          localStorage.removeItem("about_location");
          localStorage.removeItem("about_presence");
          localStorage.removeItem("about_worktime");
          setRequestBecameCuratorSuccess(true)
        }
      } catch (err) {
        setRequestBecameCuratorFail(true)
        console.log(err, "handleDeliveryOrTaskFeedbackSubmit deliveryFeedback")
      }
    } else {
      setRequestBecameCuratorFail(true)
    }
  }

  function handleInfoInput() {
    if (requestBody.about_location.length > 5 && requestBody.about_presence.length > 5 && requestBody.about_worktime.length > 5) {
      setButtonActive(true)
    } else setButtonActive(false)
  }

  return (
    <>
      <div className="z-[51] w-full max-w-[500px] flex flex-col rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo px-4 pb-8"
      onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center self-start mt-[25px]">
          <Big_pencil className="w-[32px] h-[32px] fill-[#0A0A0A] bg-light-gray-1 rounded-full dark:fill-[#F8F8F8] dark:bg-light-gray-6"/>
          <p className="ml-[14px] font-gerbera-h3 dark:text-light-gray-1">
            Расскажите, в свободной форме
          </p>
        </div>

        <Form.Root
           className="flex flex-col items-center justify-center"
          onSubmit={e => {
            e.preventDefault();
            handleRequestSubmit()
          }}
         >
          <div  className='flex flex-col'>
            <Form.Field name="about_location" className="mt-4">
              <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3">
              На какой локации вы бы хотели стать куратором и почему?
              </Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="min-w-[328px] w-full bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                placeholder:text-light-gray-3 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('about_location') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('about_location', e.target.value);
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
              <Form.Field name="about_presence" className="mt-4">           
                <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3 dark:text-light-gray">Готовы ли вы присутствовать на локации во время доставок?</Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="min-w-[328px] w-full bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                 placeholder:text-light-gray-3 mb-2 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('about_presence') ?? ''}
                  onChange={e => {
                   handleFormFieldChange('about_presence', e.target.value);
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
            <Form.Field name="about_worktime" className="mt-4">
              <Form.Label className="font-gerbera-sub2 text-light-gray-4 line-clamp-3">
              Какой у вас график работы/ учёбы?
              </Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="min-w-[328px] w-full bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2 focus: outline-0 mt-2
                placeholder:text-light-gray-3 dark:bg-light-gray-6 dark:text-light-gray-1 dark:placeholder:text-light-gray-1"
                  required
                  defaultValue={localStorage.getItem('about_worktime') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('about_worktime', e.target.value);
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

              } else e.preventDefault();

              // if (requestSent) {
              //   e.preventDefault()
              // }
          }}
          >Отправить</button>
        </Form.Root>
      </div>
      <ConfirmModal
        isOpen={requestBecameCuratorFail}
        onOpenChange={setRequestBecameCuratorFail}
        onConfirm={() => {setRequestBecameCuratorFail(false);}}
        title={<p>
          Упс, что-то пошло не так!<br />
          Попробуйте позже
        </p>}
        description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
      />
      <ConfirmModal
        isOpen={requestBecameCuratorSuccess}
        onOpenChange={setRequestBecameCuratorSuccess}
        onConfirm={() => {setRequestBecameCuratorSuccess(false);}}
        title={"Отлично! Ваша заявка отправлена на рассмотрение!"}
        description=""
        confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
      />

    </>
  );
};

export default BecameCurator;
