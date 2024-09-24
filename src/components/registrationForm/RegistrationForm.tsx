//import { useState, useEffect } from "react";
import * as Form from '@radix-ui/react-form';
import { PictuteUpload } from './../ui/PictureUpload/PictureUpload';
import './index.css';
import { Modal } from '../ui/Modal/Modal';
import { useState } from 'react';
import { CheckboxElement } from '../ui/CheckboxElement/CheckboxElement';

function getAgeFromBirthDate(birthDateString: string): number {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default function RegistrationForm() {
  // tg_id: number,
  // phone: string,
  // is_adult: boolean,
  // consent_to_personal_data: boolean
  const [registrationActive, setRegistrationActive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); /// открыть модальное для загрузки своей фотографии
  const [pictureConfirmed, setPictureConfirmed] = useState(false); // подтвердил ли юзер загруженное фото
  const [uploadedPictureLink, setUploadedPictureLink] = useState(''); /// ссылка на загруженое фото

  const [isAdult, setIsAdult] = useState(true); /// взрослый или жо 18 лет, по умолчанию взрослый, меняется при вводе даты рождения
  // const [isParentsAgreementModalOpen, setIsParentsAgreementModalOpen] =
  //   useState(false); ///// открыть модальное окно для загрузки разрешения родителей
  // const [parentAgreementUploaded, setParentAgreementUploaded] = useState(false); // загружено ли изображение согласия подписанное родителем
  // const [uploadedParentAgreementLink, setuploadedParentAgreementLink] =
  //   useState(''); //// ссылка на загруженое фосо согласия родителей

  function detectAdultorNot(birthDate: string): void {
    const age = getAgeFromBirthDate(birthDate);
    setIsAdult(age >= 18);
  }

  return (
    <Form.Root>
      <div className="flex flex-col justify-around items-center w-fit h-fit">
        <div className="flex flex-col justify-around items-center w-fit h-[539px]">
          <div className="font-gerbera-h1 my-">Зарегистрироваться</div>
          <div className="w-fit h-min-[364px] flex flex-col justify-between">
            <Form.Field name="last_name">
              <Form.Control asChild>
                <input
                  className="formField"
                  placeholder="Фамилия"
                  type="text"
                  required
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста, введите вашу фамилию
              </Form.Message>
            </Form.Field>

            <Form.Field name="name">
              {/* <Label>Email</Label> */}
              <Form.Control asChild>
                <input
                  className="formField"
                  placeholder="Имя"
                  type="text"
                  required
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста, введите ваше имя
              </Form.Message>
            </Form.Field>

            <Form.Field name="surname">
              {/* <Label>Email</Label> */}
              <Form.Control asChild>
                <input
                  className="formField"
                  placeholder="Отчество"
                  type="text"
                  required
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Отчество не может быть короче трех символов
              </Form.Message>
            </Form.Field>

            <Form.Field name="birthDate">
              <Form.Control asChild>
                <input
                  name="age"
                  className="formField"
                  placeholder="Дата рождения"
                  type="date"
                  onChange={e => detectAdultorNot(e.currentTarget.value)}
                  // onSelect=
                  required
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста введите дату рождения
              </Form.Message>
            </Form.Field>

            <Form.Field name="email">
              <Form.Control asChild>
                <input
                  name="email"
                  className="formField"
                  placeholder="Email"
                  type="email"
                  required
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="error">
                Пожалуйста введите ваш имейл
              </Form.Message>
              <Form.Message match="typeMismatch" className="error">
                Неверный имейл
              </Form.Message>
            </Form.Field>

            <div>
              <Form.Field name="city">
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Город проживания"
                    type="select"
                    required
                  />
                </Form.Control>
                <Form.Message match="valueMissing" className="error">
                  Пожалуйста выберете город проживания
                </Form.Message>
              </Form.Field>
            </div>
          </div>
          {isAdult ? (
            <CheckboxElement>
              <label className="font-gerbera-sub2 text-light-gray-6 w-[261px]">
                Я принимаю условия{' '}
                <a href="*" className="text-light-brand-green font-normal">
                  договора-оферты.
                </a>
              </label>
            </CheckboxElement>
          ) : (
            ''
          )}
        </div>

        <div className="flex flex-col justify-between h-min-">
          {pictureConfirmed ? (
            <div className="flex flex-col justify-around items-center h-[160px] mb-3.5">
              <div className=" bg-light-gray-1 rounded-full flex justify-center items-center mb-8 relative">
                <img
                  src={uploadedPictureLink}
                  className="h-[108px] w-[108px] rounded-full"
                />
                <img
                  src="./../src/assets/icons/small_pencile_bg_gray.svg"
                  className="absolute bottom-0 right-0"
                />
                <input
                  //  onChange={e => handleFileChange(e)}
                  type="file"
                  accept="image/*;capture=camera"
                  className="absolute opacity-0 h-[32px] w-[32px] rounded-full cursor-pointer bottom-0 right-0"
                  // onClick={(e) => {}}
                />
              </div>
              <p className="font-gerbera-h1">Ваше фото подтверждено!</p>
            </div>
          ) : (
            <div className="flex justify-between place-items-start my-4">
              <div className="w-[235px] h-[72px] flex flex-col justify-between items-start">
                <h3 className="font-gerbera-h3 text-light-gray-black">
                  Загрузите свое фото
                </h3>
                <p className="font-gerbera-sub1 text-light-gray-6 text-left">
                  Для продолжения регистрации, пожалуйста, сфотографируйтесь или
                  загрузите ваше фото в формате jpg
                </p>
              </div>
              <img
                src="./../src/assets/icons/photo.svg"
                className="h-[35px] w-[38px] cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              />
            </div>
          )}

          <button
            className={
              registrationActive ? 'btn-B-GreenDefault my-8' : 'btn-B-GreenInactive  my-8'
            }
            onClick={e => {
              e.preventDefault();
              registrationActive ? alert('ok') : () => {};
            }}
          >
            Отправить заявку
          </button> 
        </div>
       
        {/* <Modal
            isOpen={isParentsAgreementModalOpen}
            onOpenChange={setIsParentsAgreementModalOpen}
          > */}
        {/* <PictuteUpload
              text="Сфотографируйте согласие на обработку данных подписанное родителем"
              pictureConfirmed={parentAgreementUploaded}
              setPictureConfirmed={setParentAgreementUploaded}
              onOpenChange={setIsParentsAgreementModalOpen}
              uploadedFileLink={uploadedParentAgreementLink}
              setUploadedFileLink={setuploadedParentAgreementLink}
              localeStorageName="parentsAgreement"
            />
          </Modal> */}
        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <PictuteUpload
            text="Сфотографируйтесь на камеру своего телефона"
            pictureConfirmed={pictureConfirmed}
            setPictureConfirmed={setPictureConfirmed}
            onOpenChange={setIsModalOpen}
            uploadedFileLink={uploadedPictureLink}
            setUploadedFileLink={setUploadedPictureLink}
            localeStorageName="avatarPic"
          />
        </Modal>
      </div>
    </Form.Root>
  );
}
