// Notifications.test.tsx
import React from 'react';
import { render, screen, fireEvent, getByText } from '@testing-library/react';
import Notifications  from '../../src/components/Notifications/Notifications';
import { TokenContext } from '../../src/core/TokenContext';
import userEvent from '@testing-library/user-event';



// Моки для контекста и API
const mockToken = 'test-token';

const mockDelivery = {
  id: 1,
  date: '2023-10-01T10:00:00Z',
  location: {
    subway: 'Test Metro',
    address: 'Test Address',
  },
};

const mockTask= {
  id: 2,
  name: 'Test Task',
  description: 'Test Description',
  start_date: '2023-10-01T10:00:00Z',
  end_date: '2023-10-01T12:00:00Z',
  category: 'Test Category',
};

const mockPromotion= {
  id: 3,
  name: 'Test Promotion',
  start_date: '2023-10-01T10:00:00Z',
  address: 'Test Address',
  category: 'Test Category',
  is_permanent: false,
};

const mockNotificationsToday = [
  {
    objType: 'delivery',
    nameOrMetro: 'Test Metro',
    addressOrInfo: 'Test Address',
    stringStart: '01 октября в 10:00',
    id: 1,
    idString: 'delivrtry1',
    timeString: '2023-10-01T10:00:00Z',
    oneDay: true,
  },
];

const mockNotificationsTomorrow = [
  {
    objType: 'task',
    nameOrMetro: 'Test Task',
    addressOrInfo: 'Test Description',
    stringStart: '01 октября в 10:00',
    id: 2,
    idString: 'task2',
    timeString: '2023-10-01T10:00:00Z',
    oneDay: true,
  },
];

describe('Notifications Component', () => {
  const onCloseMock = jest.fn();
  const setAllNotConfirmedTodayMock = jest.fn();
  const setAllNotConfirmedTomorrowMock = jest.fn();
  const setAllTasksNotConfirmedTodayMock = jest.fn();
  const setAllTasksNotConfirmedTomorrowMock = jest.fn();
  const setAllPromoNotConfirmedTodayMock = jest.fn();
  const setAllPromoNotConfirmedTomorrowMock = jest.fn();
  // const confirmDelivery = jest.fn()
  const renderNotifications = () => {
    return render(
      <TokenContext.Provider value={{ token: mockToken }}>
        <Notifications
          onClose={onCloseMock}
          open={true}
          allNotConfirmedToday={[mockDelivery]}
          setAllNotConfirmedToday={setAllNotConfirmedTodayMock}
          allNotConfirmedTomorrow={[]}
          setAllNotConfirmedTomorrow={setAllNotConfirmedTomorrowMock}
          allTasksNotConfirmedToday={[mockTask]}
          setAllTasksNotConfirmedToday={setAllTasksNotConfirmedTodayMock}
          allTasksNotConfirmedTomorrow={[]}
          setAllTasksNotConfirmedTomorrow={setAllTasksNotConfirmedTomorrowMock}
          allPromoNotConfirmedToday={[mockPromotion]}
          setAllPromoNotConfirmedToday={setAllPromoNotConfirmedTodayMock}
          allPromoNotConfirmedTomorrow={[]}
          setAllPromoNotConfirmedTomorrow={setAllPromoNotConfirmedTomorrowMock}
        />
      </TokenContext.Provider>
    );
  };

  it('renders without crashing if no notifications', () => {
    expect(screen.queryByText('Уведомления')).toBeNull();
    expect(screen.queryByTestId('bread')).toBeNull();

    render(
      <TokenContext.Provider value={{ token: mockToken }}>
        <Notifications
          onClose={onCloseMock}
          open={true}
          allNotConfirmedToday={[]}
          setAllNotConfirmedToday={setAllNotConfirmedTodayMock}
          allNotConfirmedTomorrow={[]}
          setAllNotConfirmedTomorrow={setAllNotConfirmedTomorrowMock}
          allTasksNotConfirmedToday={[]}
          setAllTasksNotConfirmedToday={setAllTasksNotConfirmedTodayMock}
          allTasksNotConfirmedTomorrow={[]}
          setAllTasksNotConfirmedTomorrow={setAllTasksNotConfirmedTomorrowMock}
          allPromoNotConfirmedToday={[]}
          setAllPromoNotConfirmedToday={setAllPromoNotConfirmedTodayMock}
          allPromoNotConfirmedTomorrow={[]}
          setAllPromoNotConfirmedTomorrow={setAllPromoNotConfirmedTomorrowMock}
        />
      </TokenContext.Provider>
    );
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
    expect(screen.getByTestId('bread')).toBeInTheDocument();
  });
 

  it('renders notifications for today', () => {
    expect(screen.queryByText('Уведомления')).toBeNull();
    expect(screen.queryByText('Сегодня')).toBeNull();
    expect(screen.queryByText('Завтра')).toBeNull();
    renderNotifications();
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
    expect(screen.getByText('Сегодня')).toBeInTheDocument();
    expect(screen.queryByText('Завтра')).toBeNull();
    expect(screen.getByText('Подтвердите доставку')).toBeInTheDocument();
  });

  it('renders notifications for tomorrow', () => {
    expect(screen.queryByText('Уведомления')).toBeNull();
    expect(screen.queryByText('Сегодня')).toBeNull();
    expect(screen.queryByText('Завтра')).toBeNull();
    render(
      <TokenContext.Provider value={{ token: mockToken }}>
        <Notifications
          onClose={onCloseMock}
          open={true}
          allNotConfirmedToday={[]}
          setAllNotConfirmedToday={setAllNotConfirmedTodayMock}
          allNotConfirmedTomorrow={[mockDelivery]}
          setAllNotConfirmedTomorrow={setAllNotConfirmedTomorrowMock}
          allTasksNotConfirmedToday={[]}
          setAllTasksNotConfirmedToday={setAllTasksNotConfirmedTodayMock}
          allTasksNotConfirmedTomorrow={[mockTask]}
          setAllTasksNotConfirmedTomorrow={setAllTasksNotConfirmedTomorrowMock}
          allPromoNotConfirmedToday={[]}
          setAllPromoNotConfirmedToday={setAllPromoNotConfirmedTodayMock}
          allPromoNotConfirmedTomorrow={[mockPromotion]}
          setAllPromoNotConfirmedTomorrow={setAllPromoNotConfirmedTomorrowMock}
        />
      </TokenContext.Provider>
    )
    expect(screen.getByText('Завтра')).toBeInTheDocument();
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
    expect(screen.queryByText('Сегодня')).toBeNull();
    expect(screen.getByText('Подтвердите участие в добром деле')).toBeInTheDocument();
    expect(screen.getByText('Подтвердите доставку')).toBeInTheDocument();
    expect(screen.getByText('Подтвердите бронь')).toBeInTheDocument();
  });

  it('calls confirm function when confirm button is clicked', () => {
    renderNotifications();
    const confirmButton = screen.getAllByText('Подтвердить')[0];
    fireEvent.click(confirmButton);
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument;
    const finalConfirm = screen.getByTestId('confirmRunFunc');
    // screen.debug()
   fireEvent.click(finalConfirm);
    //  expect(setAllNotConfirmedTodayMock).toHaveBeenCalledWith(true);
  });

  it('calls cancel function when cancel button is clicked', async () => {
    render(
      <TokenContext.Provider value={{ token: mockToken }}>
        <Notifications
          onClose={onCloseMock}
          open={true}
          allNotConfirmedToday={[mockDelivery]}
          setAllNotConfirmedToday={setAllNotConfirmedTodayMock}
          allNotConfirmedTomorrow={[]}
          setAllNotConfirmedTomorrow={setAllNotConfirmedTomorrowMock}
          allTasksNotConfirmedToday={[]}
          setAllTasksNotConfirmedToday={setAllTasksNotConfirmedTodayMock}
          allTasksNotConfirmedTomorrow={[]}
          setAllTasksNotConfirmedTomorrow={setAllTasksNotConfirmedTomorrowMock}
          allPromoNotConfirmedToday={[]}
          setAllPromoNotConfirmedToday={setAllPromoNotConfirmedTodayMock}
          allPromoNotConfirmedTomorrow={[]}
          setAllPromoNotConfirmedTomorrow={setAllPromoNotConfirmedTomorrowMock}
        />
      </TokenContext.Provider>
    )
    const cancelButton = screen.getAllByText('Отказаться')[0];
    fireEvent.click(cancelButton);
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    const finalConfirm = screen.getByTestId('confirmRunFunc');
    fireEvent.click(finalConfirm);
    screen.debug()
    // expect(confirmDelivery).toHaveBeenCalledWith(mockDelivery);
  });


 // Тест на фильтрацию данных
 it('calls confirm function when confirm button is clicked', async () => {

  //  postDeliveryConfirm = jest.fn();
   getDeliveryById = jest.fn();
   confirmDelivery = jest.fn()
   cancelDelivery = jest.fn()
   handleConfirmClick = jest.fn();
   handleCancelClick = jest.fn()
   
  // await postDeliveryConfirm.mockImplementation((token, mockDelivery) => { return true });

  //  const {
  //   cancelDelivery,
  // } = require('../../src/components/Notifications/helperFunctions');
  // await confirmDelivery.mockImplementation(
  //   (
  //     mockDelivery,
  //     setNotifDay,
  //     allNotConfirmed,
  //     setAllNotConfirmed,
  //     token,
  //     setConfirmedSuccess,
  //     setConfirmedSuccessString,
  //     setConfirmFailed,
  //     setConfirmFailedString
  //   ) => {
  //     setAllNotConfirmed([]);
  //   },
  // );

   render(
    <TokenContext.Provider value={{ token: mockToken }} >
    <Notifications
    onClose={onCloseMock}
    open={true}
    allNotConfirmedToday={[mockDelivery]}
    setAllNotConfirmedToday={setAllNotConfirmedTodayMock}
    allNotConfirmedTomorrow={[]}
    setAllNotConfirmedTomorrow={setAllNotConfirmedTomorrowMock}
    allTasksNotConfirmedToday={[]}
    setAllTasksNotConfirmedToday={setAllTasksNotConfirmedTodayMock}
    allTasksNotConfirmedTomorrow={[]}
    setAllTasksNotConfirmedTomorrow={setAllTasksNotConfirmedTomorrowMock}
    allPromoNotConfirmedToday={[]}
    setAllPromoNotConfirmedToday={setAllPromoNotConfirmedTodayMock}
    allPromoNotConfirmedTomorrow={[]}
    setAllPromoNotConfirmedTomorrow={setAllPromoNotConfirmedTomorrowMock}
  />
</TokenContext.Provider >);
   
   const cancelButton = screen.getAllByText('Отказаться')[0];
   await userEvent.click(cancelButton);
   screen.debug()
   expect(await screen.getByTestId('confirm-modal')).toBeInTheDocument();
   const finalConfirm = screen.getByTestId('confirmRunFunc');
   await userEvent.click(finalConfirm);
  //  setAllNotConfirmedToday = jest.mock([])
  //  
  //  expect(await cancelDelivery).toHaveBeenCalled();
  //  screen.debug()
  // expect(await screen.queryByText('Подтвердить')).toBeNull()
});


});