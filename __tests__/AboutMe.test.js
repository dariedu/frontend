import  React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import AboutMe from '../src/components/AboutMe/AboutMe';
import { describe } from 'node:test';
import userEvent from '@testing-library/user-event';
// import { TokenContext } from '../src/core/TokenContext';
// import { UserContext } from '../src/core/UserContext';


  // const renderComponent = () => {
  //   return render(
  //     <TokenContext.Provider value={{token: 'mock-token'}}>
  //       <UserContext.Provider value={{
  //       currentUser: {
  //           id: 1,
  //           metier: "developer"
  //       },
  //     }}>
  //         <AboutMe onClose={jest.fn()} />
  //       </UserContext.Provider>
  //     </TokenContext.Provider>
  //   );
  // };

describe('AboutMe.tsx', () => {

    beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders AboutMe.ts",  () => {
    render(
              <AboutMe onClose={jest.fn()} />
        )
    expect(screen.getByText(/Обо мне/)).toBeInTheDocument();
    expect(screen.getByText(/Выберите ваш род деятельности/)).toBeInTheDocument();
  });

  it("renders inpit in AboutMe.ts", async () => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const { getByTestId } = render(
              <AboutMe onClose={jest.fn()} />
    )
    expect(screen.queryByText(/qwertyuiop/)).toBeNull();
    await userEvent.type(getByTestId('textbox'), 'qwertyuiop');
    expect(await screen.findByText(/qwertyuiop/)).toBeInTheDocument()
  })

  it('function handleRequestSubmit() fails and shown fail ConfirmModal', async () => {
    const { getByTestId } = render(
              <AboutMe onClose={jest.fn()} />
    )
    expect(screen.queryByText(/Упс, что-то пошло не так!/)).toBeNull();
    await userEvent.type(getByTestId('textbox'), 'qwertyuiop');
    expect(screen.getByText('Сохранить')).toHaveStyle({backgroundColor: "light-brand-green"})
    fireEvent.click(screen.getByText('Сохранить'));
    expect(await screen.findByText(/Упс, что-то пошло не так!/)).toBeInTheDocument();
    expect(await screen.findByTestId('confirm-modal')).toBeInTheDocument();
  
  });

  it('onClick of inputOptions the options are shown; and onClick of one of the options the choice is made', () => {  
    
    const { getByTestId, getByText } = render(
              <AboutMe onClose={jest.fn()} />
    )
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "none" })
    fireEvent.click(getByTestId('choice'));
    expect(getByTestId('hiddenDiv')).toHaveStyle({ backgroundColor: "light-gray-1" })
    fireEvent.click(getByText('Работаю по найму'));
    expect(getByTestId('choice')).toHaveTextContent('Работаю по найму');
  });

  // it('shows success modal on successful save', async () => {

  //   jest.mock('../src/api/userApi', () => ({
  //     patchUser: jest.fn(),
  //   }));
  //   const { patchUser } = require('../src/api/userApi');
  //   await patchUser.mockResolvedValue({});
  //   renderComponent();
  //   const textarea = screen.getByPlaceholderText(/Кто вы по профессии/);

  //   await userEvent.type(textarea, 'New about me text');
  //   await userEvent.click(screen.getByText('Сохранить'));

  //   expect(await screen.findByText(/Спасибо, что поделились!/)).toBeInTheDocument();
  //   expect(await screen.findByTestId('confirm-modal')).toBeInTheDocument();
  // });
  
})
