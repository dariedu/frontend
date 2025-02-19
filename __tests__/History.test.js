import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import History from '../src/components/History/History';
import { describe } from 'node:test';

describe('History.tsx', () => {
  
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });

  it('should render correctly', () => {
  
    render(<History />)
})

})

// import React from 'react';
// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// import History from '../src/components/History/History';
// import { TokenContext } from '../src/core/TokenContext';
// // import jest from 'jest'
// // import { getVolunteerDeliveries, getMyTasks, getMyPastOrActivePromotions, getCuratorDeliveries, getDeliveryById } from '../src/api/apiDeliveries';
// // import { Modal } from '../ui/Modal/Modal';
// import FilterPromotions from '../src/components/FilterPromotions/FilterPromotions';

// // Мок для API
// jest.mock('../src/api/apiDeliveries', () => ({
//   getVolunteerDeliveries: jest.fn(),
//   getMyTasks: jest.fn(),
//   getMyPastOrActivePromotions: jest.fn(),
//   getCuratorDeliveries: jest.fn(),
//   getDeliveryById: jest.fn(),
// }));

// Мок для Modal и FilterPromotions
// jest.mock('../src/ui/Modal/Modal', () => ({
//   Modal: jest.fn(({ children, isOpen }) => (isOpen ? <div>{children}</div> : null),)
// }));
// jest.mock('../src/components/FilterPromotions/FilterPromotions', () => ({
//   __esModule: true,
//   default: jest.fn(() => <div>FilterPromotions</div>),
// }));

// describe('History Component', () => {
//   const onClose = jest.fn();
//   const token = 'test-token';

//   const mockDeliveries = [
//     {
//       id: '1',
//       date: '2023-10-01T12:00:00Z',
//       price: 100,
//       location: { subway: 'Test Subway' },
//     },
//   ];

//   const mockTasks = [
//     {
//       id: '1',
//       start_date: '2023-10-01T12:00:00Z',
//       category: { name: 'Test Category' },
//       volunteer_price: 50,
//       is_completed: true,
//     },
//   ];

//   const mockPromotions = [
//     {
//       id: '1',
//       start_date: '2023-10-01T12:00:00Z',
//       name: 'Test Promotion',
//       price: 200,
//     },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//   })
//     // const getVolunteerDeliveries = jest.fn();
//     // (getVolunteerDeliveries).mockResolvedValue({
//     //   'мои завершенные доставки': mockDeliveries,
//     // });
//   //   const getMyTasks = jest.fn();
//   //   const getMyPastOrActivePromotions = jest.fn();
//   //   const getDeliveryById = jest.fn();
//   //   (getMyTasks).mockResolvedValue(mockTasks);
//   //   (getMyPastOrActivePromotions).mockResolvedValue(mockPromotions);
//   //   (getCuratorDeliveries = jest.fn()).mockResolvedValue({
//   //     'завершенные доставки': [],
//   //   });
//   //   (getDeliveryById).mockResolvedValue(mockDeliveries[0]);
//   // });

//   // Тест на рендеринг компонента
//   it('renders correctly', () => {
//     render(
//       <TokenContext.Provider value={{ token }}>
//         <History onClose={onClose} isVolunteer={true} />
//       </TokenContext.Provider>
//     );

//     expect(screen.getByText('История')).toBeInTheDocument();
//   });

//   // // Тест на отображение данных
//   // it('displays data after loading', async () => {
//   //   render(
//   //     <TokenContext.Provider value={{ token }}>
//   //       <History onClose={onClose} isVolunteer={true} />
//   //     </TokenContext.Provider>
//   //   );

//   //   await waitFor(() => {
//   //     expect(screen.getByText('Доставка')).toBeInTheDocument();
//   //     expect(screen.getByText('Test Category')).toBeInTheDocument();
//   //     expect(screen.getByText('Test Promotion')).toBeInTheDocument();
//   //   });
//   // });

//   // // Тест на фильтрацию данных
//   // it('filters data correctly', async () => {
//   //   render(
//   //     <TokenContext.Provider value={{ token }}>
//   //       <History onClose={onClose} isVolunteer={true} />
//   //     </TokenContext.Provider>
//   //   );

//   //   // Открываем фильтр
//   //   fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

//   //   // Выбираем категорию "доставка"
//   //   await waitFor(() => {
//   //     expect(screen.getByText('FilterPromotions')).toBeInTheDocument();
//   //   });

//   //   // Симулируем выбор категории
    
//   //   const filterPromotionsProps = jest.fn();
//   //   (FilterPromotions).mock.calls[0][0];
//   //   filterPromotionsProps.handleCategoryChoice({ id: 1, name: 'доставка' });

//   //   // Проверяем, что отображаются только доставки
//   //   await waitFor(() => {
//   //     expect(screen.getByText('Доставка')).toBeInTheDocument();
//   //     expect(screen.queryByText('Test Category')).not.toBeInTheDocument();
//   //     expect(screen.queryByText('Test Promotion')).not.toBeInTheDocument();
//   //   });
//   // });

//   // // Тест на отображение пустого состояния
//   // it('displays empty state when no data', async () => {
//   //   const getVolunteerDeliveries = jest.fn();
//   //   const getMyTasks = jest.fn();
//   //   const getMyPastOrActivePromotions = jest.fn();
//   //   (getVolunteerDeliveries).mockResolvedValue({ 'мои завершенные доставки': [] });
//   //   (getMyTasks).mockResolvedValue([]);
//   //   (getMyPastOrActivePromotions).mockResolvedValue([]);

//   //   render(
//   //     <TokenContext.Provider value={{ token }}>
//   //       <History onClose={onClose} isVolunteer={true} />
//   //     </TokenContext.Provider>
//   //   );

//   //   await waitFor(() => {
//   //     expect(screen.getByText('Пока нет завершенных добрых дел')).toBeInTheDocument();
//   //   });
//   // });

//   // Тест на открытие модального окна фильтра
//   it('opens filter modal when filter icon is clicked', () => {
//     render(
//       <TokenContext.Provider value={{ token }}>
//         <History onClose={onClose} isVolunteer={true} />
//       </TokenContext.Provider>
//     );

//     fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

//     expect(screen.getByText('FilterPromotions')).toBeInTheDocument();
//   });
// });