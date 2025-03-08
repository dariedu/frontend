import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import History from '../src/components/History/History';
import { TokenContext } from '../src/core/TokenContext';


// Мок для API
jest.mock('../src/components/History/helperFunctions', () => ({
  getMyCuratorDeliveries: jest.fn(),
  requestMyDelivery: jest.fn(),
  getMyPastDeliveries: jest.fn(),
  getMyPastTasks: jest.fn(),
  getMyPastPromotions: jest.fn(),
  combineAllPast: jest.fn(),
  filterCategoryOptions: [
    { id: 1, name: 'доставка' },
    { id: 2, name: 'доброе дело' },
    { id: 3, name: 'поощрение' },
  ],
}));


describe('History Component', () => {
  const onClose = jest.fn();
  const token = 'test-token';

  // const mockDeliveries = [
  //   {
  //     id: '1',
  //     date: '2023-10-01T12:00:00Z',
  //     price: 100,
  //     location: { subway: 'Test Subway' },
  //   },
  // ];

  // const mockTasks = [
  //   {
  //     id: '1',
  //     start_date: '2023-10-01T12:00:00Z',
  //     category: { name: 'Test Category' },
  //     volunteer_price: 50,
  //     is_completed: true,
  //   },
  // ];

  // const mockPromotions = [
  //   {
  //     id: '1',
  //     start_date: '2023-10-01T12:00:00Z',
  //     name: 'Test Promotion',
  //     price: 200,
  //   },
  // ];

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Тест на рендеринг компонента
  it('renders correctly when no history', () => {

    expect(screen.queryByText('История')).toBeNull();
    render(
      <TokenContext.Provider value={{ token }}>
        <History onClose={onClose} isVolunteer={true} />
      </TokenContext.Provider>,
    );
    expect(screen.getByText('История')).toBeInTheDocument();
    expect(screen.getByTestId('logo_no_tasks_yet')).toBeInTheDocument();
  });

  // Тест на отображение данных
  it('displays data after loading', async () => {
    const {
      combineAllPast,
    } = require('../src/components/History/helperFunctions');
    await combineAllPast.mockImplementation(
      (
        promotions,
        deliveries,
        curatorDeliveries,
        tasks,
        setAllMyPastCombined,
      ) => {
        setAllMyPastCombined([
          {
            id: '1',
            category: { id: 1, name: 'доставка' },
            startDateString: '2023-10-01T12:00:00Z',
            dayMonthYearString: '1 октября 2023',
            name: 'Доставка',
            points: 2,
            plus: true,
            date: '1 окт 12:00',
            subway: 'Test Subway',
          },
        ]);
      },
    );

    render(
      <TokenContext.Provider value={{ token }}>
        <History onClose={onClose} isVolunteer={true} />
      </TokenContext.Provider>,
    );

    expect(await screen.findByText('Доставка')).toBeInTheDocument();
    expect(await screen.findByText('1 окт 12:00')).toBeInTheDocument();
    expect(await screen.findByText('1 октября 2023')).toBeInTheDocument();
  });

  // Тест на фильтрацию данных
  it('filters data correctly', async () => {
    const {
      combineAllPast,
    } = require('../src/components/History/helperFunctions');
    await combineAllPast.mockImplementation(
      (
        promotions,
        deliveries,
        curatorDeliveries,
        tasks,
        setAllMyPastCombined,
      ) => {
        setAllMyPastCombined([
          {
            id: '1',
            category: { id: 2, name: 'доброе дело' },
            startDateString: '2023-10-01T17:00:00Z',
            dayMonthYearString: '1 октября 2023',
            name: 'Раздать листовки',
            points: 2,
            plus: true,
            date: '1 окт 17:00',
            subway: 'Test Subway',
          },
          {
            id: '2',
            category: { id: 1, name: 'доставка' },
            startDateString: '2023-10-01T12:00:00Z',
            dayMonthYearString: '1 октября 2023',
            name: 'Доставка',
            points: 2,
            plus: true,
            date: '1 окт 12:00',
            subway: 'Test Subway',
          },
          {
            id: '2',
            category: { id: 2, name: 'доброе дело' },
            dayMonthYearString: '11 февраля 2025',
            id: '132025-02-11T15:00:00+03:00',
            name: 'Написание текста',
            plus: true,
            points: 2,
            startDateString: '2025-02-11T15:00:00+03:00',
          },

          {
            id: 1,
            category: { id: 1, name: 'доставка' },
            date: '2 март 17:00',
            dayMonthYearString: '2 марта 2025',
            id: '652025-03-02T17:00:00+03:00',
            name: 'Курирование доставки',
            plus: true,
            points: 2,
            startDateString: '2025-03-02T17:00:00+03:00',
            subway: 'проспект Мира',
          },
          {
            id: 3,
            category: { id: 3, name: 'поощрение' },
            dayMonthYearString: '10 декабря 2024',
            id: '82024-12-10T17:00:00+03:00',
            name: 'Билеты в театр',
            plus: false,
            points: 4,
            startDateString: '2024-12-10T17:00:00+03:00',
          },
        ]);
      },
    );

    render(
      <TokenContext.Provider value={{ token }}>
        <History onClose={onClose} isVolunteer={false} />
      </TokenContext.Provider>,
    );
    expect(await screen.findByText('Доставка')).toBeInTheDocument();
    expect(await screen.findByText('Курирование доставки')).toBeInTheDocument();
    expect(await screen.findByText('Билеты в театр')).toBeInTheDocument();
    expect(await screen.findByText('Написание текста')).toBeInTheDocument();
    // Открываем фильтр
    fireEvent.click(screen.getByTestId('filter'));
    // Симулируем выбор категории
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute(
      'data-state',
      'checked',
    );
    fireEvent.click(screen.getByText('Применить'));
    // Проверяем, что отображаются только доставки
    expect(await screen.queryByText('Билеты в театр')).toBeNull();
    expect(await screen.queryByText('Написание текста')).toBeNull();
    expect(await screen.findByText('Доставка')).toBeInTheDocument();
    expect(await screen.findByText('Курирование доставки')).toBeInTheDocument();
  });
});
