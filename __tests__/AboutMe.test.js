import  React from 'react';
import { render, fireEvent, screen, cleanup} from '@testing-library/react';
import AboutMe from '../src/components/AboutMe/AboutMe';
import { afterEach, describe } from 'node:test';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

jest.mock('axios');

describe('AboutMe.tsx', () => {

  it("renders AboutMe.ts",  () => {
    render(<AboutMe />)
    expect(screen.getByText(/Обо мне/)).toBeInTheDocument();
    expect(screen.getByText(/Выберите ваш род деятельности/)).toBeInTheDocument();
  });

  it("renders inpit in AboutMe.ts", async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const { getByTestId } = render(<AboutMe />)
    expect(screen.queryByText(/qwertyuiop/)).toBeNull();   
    await userEvent.type(getByTestId('textbox'), 'qwertyuiop');
    expect(await screen.findByText(/qwertyuiop/)).toBeInTheDocument()
  })

  it('function handleRequestSubmit() fails and shown fail ConfirmModal', async () => {
    const { getByTestId } = render(<AboutMe />)
    expect(screen.queryByText(/Упс, что-то пошло не так!/)).toBeNull();
    await userEvent.type(getByTestId('textbox'), 'qwertyuiop');
    expect(screen.getByText('Сохранить')).toHaveStyle({backgroundColor: "light-brand-green"})
    fireEvent.click(screen.getByText('Сохранить'));
    expect(await screen.findByText(/Упс, что-то пошло не так!/)).toBeInTheDocument();
  });
  // test('function handleRequestSubmit() fails and shown fail ConfirmModal', async () => {
 

  //   render(<AboutMe />)
  //      const setRequestAboutMeSuccess = jest.fn();
  //   const useStateMock = (useState) => [useState, setRequestAboutMeSuccess];
  //   jest.spyOn(React, 'useState').mockImplementation(useStateMock);
  //   expect(screen.queryByText(/Спасибо, что поделились!/)).toBeNull();
  //   // expect(requestAboutMeSuccess).toBe(false);
  //   // fireEvent.click(screen.getByText('Сохранить'));
  //   //expect(await screen.findByText(/Спасибо, что поделились!/)).toBeInTheDocument();
  // });

  it('onClick of inputOptions the options are shown; and onClick of one of the options the choice is made', () => {
    const { getByTestId, getByText } = render(<AboutMe />)
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "none" })
    fireEvent.click(getByTestId('choice'));
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "light-gray-1" })
    fireEvent.click(getByText('Работаю по найму'));
    expect(getByTestId('choice')).toHaveTextContent('Работаю по найму');
  });


  // it('AboutMe toMatchSnapshot ', () => {
  // render(<AboutMe />)
  // expect(screen.getByTestId('maindiv')).toMatchSnapshot()
  // });

})

