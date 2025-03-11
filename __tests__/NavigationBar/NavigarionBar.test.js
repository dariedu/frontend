import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NavigationBar from '../../src/components/NavigationBar/NavigationBar';
// import { TokenContext } from '../../src/core/TokenContext';
import { UserContext } from '../../src/core/UserContext';


// Моки для контекстов
const mockUserContext = {
  currentUser: {
    id: '1',
    name: 'John Doe',
    photo: 'https://example.com/avatar.jpg',
  },
  isLoading: false,
};

// const mockTokenContext = {
//   token: 'mock-token',
// };


const mockDelivery = {
  id: 1,
  date: '2023-10-01T10:00:00Z',
  location: {
    subway: 'Test Metro',
    address: 'Test Address',
  },
};

 
// Моки для SVG и других компонентов
jest.mock('../../src/components/ProfileUser/ProfileUser', () => () => <div>ProfileUser</div>);
jest.mock('../../src/components/Notifications/Notifications', () => () => <div>Notifications</div>);

describe('NavigationBar', () => {

  // jest.mock('../../src/components/NavigationBar/helperFunctions.ts', () => ({
  //   getMyDeliveries: jest.fn(() => Promise.resolve()),
  //   getListNotConfirmed: jest.fn(() => Promise.resolve()),
  //   getTasksListNotConfirmed: jest.fn(() => Promise.resolve()),
  //   getAllMyTasks: jest.fn(() => Promise.resolve()),
  //   getPromoListNotConfirmed: jest.fn(() => Promise.resolve()),
  //   getAllMyPromo: jest.fn(() => Promise.resolve()),

  // }));
 
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for mainScreen variant', async () => {
   expect(screen.queryByText('J')).toBeNull();
    render(
      <UserContext.Provider value={mockUserContext}>
          <NavigationBar variant="mainScreen" isVolunteer={false} />
      </UserContext.Provider>
    );

    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('notificationsBell')).toBeInTheDocument();
  });


  it('opens profile when avatar is clicked', async () => {
    expect(screen.queryByText('J')).toBeNull();
     render(
       <UserContext.Provider value={mockUserContext}>
           <NavigationBar variant="mainScreen" isVolunteer={false} />
       </UserContext.Provider>
    );
    const user = screen.getByText('J');
    expect( screen.queryByText('ProfileUser')).toBeNull();
    expect( screen.getByText('J')).toBeInTheDocument();
     expect( screen.getByTestId('logo')).toBeInTheDocument();
     expect( screen.getByTestId('notificationsBell')).toBeInTheDocument();
    fireEvent.click(user)
    // screen.debug()
    expect( screen.getByText('ProfileUser')).toBeInTheDocument();
     expect( screen.getByText('J')).toBeInTheDocument();
     expect(screen.getByTestId('logo')).toBeInTheDocument();
     expect(screen.getByTestId('notificationsBell')).toBeInTheDocument();
   });

  it('renders correctly for volunteerForm variant', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
          <NavigationBar variant="volunteerForm" title="Volunteer Form" isVolunteer={false} />
      </UserContext.Provider>
    );

    expect(screen.getByText('Volunteer Form')).toBeInTheDocument();
    expect(screen.queryByTestId('notificationsBell')).toBeNull();
  });


  it('open notifications when notification icon is clicked', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
          <NavigationBar variant="mainScreen" isVolunteer={true} />
      </UserContext.Provider>
    );
    expect(screen.queryByText('Notifications')).toBeNull();
    fireEvent.click(screen.getByTestId('notificationsBell'));
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });


  it('displays loading state when isLoading is true', () => {
    render(
      <UserContext.Provider value={{ ...mockUserContext, isLoading: true }}>
          <NavigationBar variant="mainScreen" isVolunteer={false} />
      </UserContext.Provider>
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });
    // it('should have the pulse class when there are notifications', async () => {
  //   const { checkHaveNotification } = require('../../src/components/NavigationBar/helperFunctions');
  //    checkHaveNotification.mockImplementation(
  //     (
  //       allNotConfirmedToday,
  //       allNotConfirmedTomorrow,
  //       allTasksNotConfirmedToday,
  //       allTasksNotConfirmedTomorrow,
  //       allPromoNotConfirmedToday,
  //       allPromoNotConfirmedTomorrow,
  //       setHaveNotifications
  //     ) => {
  //       setHaveNotifications(true);
  //     },
  //   );

  //   render(
  //     <UserContext.Provider value={mockUserContext}>
  //         <NavigationBar variant="mainScreen" isVolunteer={false}  />
  //     </UserContext.Provider>
  //   );
  //   screen.debug()
  //   expect(await screen.findByTestId('notificationsPulse')).toBeInTheDocument()
  //   // expect(pulseElement).toHaveClass('pulse');
  // });

  it('displays user not found when currentUser is null', () => {
    render(
      <UserContext.Provider value={{ ...mockUserContext, currentUser: null }}>
          <NavigationBar variant="mainScreen" isVolunteer={false} />
      </UserContext.Provider>
    );

    expect(screen.getByText('Пользователь не найден')).toBeInTheDocument();
  });
});