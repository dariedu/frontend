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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParentsAgreementModalOpen, setIsParentsAgreementModalOpen] =
    useState(false);
  const [registrationActive, setRegistrationActive] = useState(false);
  const [isAdult, setIsAdult] = useState(true);

  function detectAdultorNot(birthDate: string): void {
    const age = getAgeFromBirthDate(birthDate);
    setIsAdult(age >= 18);
  }

  return (
    <>
      <Form.Root>
        <div className="flex flex-col justify-around items-center w-fit h-[764px]">
          <div className="font-gerbera-h1">Зарегистрироваться</div>

          <div className="w-fit h-[364px] flex flex-col justify-between">
            <div>
              <Form.Field name="last_name">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Фамилия"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="name">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your имя
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Имя"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="surname">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your отчество
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Отчество"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="birthDate">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your birthDate
                </Form.Message>
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
              </Form.Field>
            </div>
            <div>
              <Form.Field name="email">
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Message match="typeMismatch">
                  Please provide a valid email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    name="email"
                    className="formField"
                    placeholder="Email"
                    type="email"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
            <div>
              <Form.Field name="city">
                {/* <Label>Email</Label> */}
                <Form.Message match="valueMissing">
                  Please enter your email
                </Form.Message>
                <Form.Message match="typeMismatch">
                  Please provide a valid email
                </Form.Message>
                <Form.Control asChild>
                  <input
                    className="formField"
                    placeholder="Город проживания"
                    type="text"
                    required
                  />
                </Form.Control>
              </Form.Field>
            </div>
          </div>
          {isAdult ? (
            <CheckboxElement>
              <label className="font-gerbera-sub2 text-light-gray-6 w-[261px] h-[21px]">
                Я подтверждаю свое согласие на{' '}
                <a href="*" className="text-light-brand-green font-normal">
                  обработку персональных данных.
                </a>
              </label>
            </CheckboxElement>
          ) : (
            <div className="flex justify-between ">
              <img
                src="./../src/assets/icons/photo.svg"
                className="mr-2.5 cursor-pointer w-7 h-7"
                onClick={() => {
                  setIsParentsAgreementModalOpen(true);
                }}
              />
              <p className="font-gerbera-sub2 text-light-gray-6 w-[261px] h-[21px]">
                Я подтверждаю свое согласие на{' '}
                <a href="*" className="text-light-brand-green font-normal">
                  обработку персональных данных.
                </a>
              </p>
            </div>
          )}

          <div className="flex flex-col justify-between h-[152px]">
            <div className="flex justify-between place-items-start ">
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
            <button
              className={
                registrationActive
                  ? 'btn-B-GreenDefault'
                  : 'btn-B-GreenInactive'
              }
              onClick={e => {
                e.preventDefault();
                registrationActive ? alert('ok') : () => {};
              }}
            >
              Отправить заявку
            </button>
          </div>
          <Modal
            isOpen={isParentsAgreementModalOpen}
            onOpenChange={setIsParentsAgreementModalOpen}
          >
            <PictuteUpload text="Сфотографируйте согласие на обработку данных подписанное родителем" />
          </Modal>
          <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <PictuteUpload text="Сфотографируйтесь на камеру своего телефона" />
          </Modal>
        </div>
      </Form.Root>
    </>
  );
}
