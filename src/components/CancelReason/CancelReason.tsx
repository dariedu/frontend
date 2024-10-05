import { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import TextareaAutosize from 'react-textarea-autosize';

const CancelReason = () => {
  const [reasons, setReasons] = useState({
    reason1: localStorage.getItem('reason1') ?? '',
    reason2: localStorage.getItem('reason2') ?? '',
    reason3: localStorage.getItem('reason3') ?? '',
  });

  type TReasons = keyof typeof reasons;

  // при каждом изменении в полях формы вносим изменения в юзера и обновляем localeStorage
  function handleFormFieldChange(fieldName: TReasons, value: string) {
    setReasons({
      ...reasons,
      [fieldName]: value,
    });
    localStorage.setItem(fieldName, value);
  }

  return (
    <>
      <div className="w-[360px] h-fit flex flex-col rounded-t-2xl mt-2">
        <p>Причина отмены?</p>
        <Form.Root
          className="mt-[29px]"
          onSubmit={e => {
            e.preventDefault();
            console.log('submited');
          }}
        >
          <div>
            <Form.Field name="reason1" className="mt-4">
              <Form.Label></Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2
  placeholder:text-light-gray-3"
                  placeholder="Написать причину"
                  required
                  defaultValue={localStorage.getItem('reason1') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('reason1', e.target.value);
                  }}
                />
              </Form.Control>
              <Form.Message
                match="valueMissing"
                className="font-gerbera-sub2 text-light-error-red "
              >
                Пожалуйста, введите хотя бы одну причину
              </Form.Message>
            </Form.Field>
            <Form.Field name="reason2" className="mt-4">
              <Form.Label></Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2
  placeholder:text-light-gray-3 mb-2 "
                  placeholder="Написать причину"
                  defaultValue={localStorage.getItem('reason2') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('reason2', e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field name="reason3" className="mt-4">
              <Form.Label></Form.Label>
              <Form.Control asChild>
                <TextareaAutosize
                  maxRows={5}
                  className="w-[328px] bg-light-gray-1 h-max min-h-[68px] rounded-2xl py-4 px-3 text-light-gray-8-text font-gerbera-sub2
  placeholder:text-light-gray-3 mb-2 "
                  placeholder="Написать причину"
                  defaultValue={localStorage.getItem('reason2') ?? ''}
                  onChange={e => {
                    handleFormFieldChange('reason3', e.target.value);
                  }}
                />
              </Form.Control>
            </Form.Field>
          </div>
          <button className="btn-B-GreenDefault mt-4">Отправить</button>
        </Form.Root>
      </div>
    </>
  );
};

export default CancelReason;
