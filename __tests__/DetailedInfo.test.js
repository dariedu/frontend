import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DetailedInfo from '../src/components/DetailedInfo/DetailedInfo';
import { TokenContext } from '../src/core/TokenContext';
import userEvent from '@testing-library/user-event';
// import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';

// Моки для контекста
const mockTokenContext = {
  token: 'mock-token',
};

// Мок для API
jest.mock('../src/api/userApi', () => ({
  getUserById: jest.fn(),
}));

describe('DetailedInfo', () => {
  const onOpenChangeMock = jest.fn();
  const makeReservationFuncMock = jest.fn();
  const cancelPromotionMock = jest.fn();

  const promotion = {
    id: 1,
    name: 'Test Promotion',
    address: 'Test Address',
    start_date: '2023-10-01T12:00:00Z',
    is_permanent: false,
    about_tickets: 'Test ticket info',
    category: { name: 'Test Category' },
    price: 100,
    description: 'Test Description',
    picture: 'https://test.com/image.jpg',
    contact_person: 1,
  };

  const renderComponent = (reserved = false, optional = false) => {
    return render(
      <TokenContext.Provider value={mockTokenContext}>
        <DetailedInfo
          onOpenChange={onOpenChangeMock}
          optional={optional}
          promotion={promotion}
          reserved={reserved}
          makeReservationFunc={makeReservationFuncMock}
          cancelPromotion={cancelPromotionMock}
        />
      </TokenContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Promotion')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Как получить билет?')).toBeInTheDocument();
    expect(screen.getByText('Время начала')).toBeInTheDocument();
    expect(screen.getByText('Списание баллов')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByText('Забронировать')).toBeInTheDocument();
  });

  it('renders correctly for reserved promotion', () => {
    renderComponent(true);
    expect(screen.getByText('Отказаться')).toBeInTheDocument();
  });

  it('renders correctly for optional promotion', () => {
    renderComponent(false, true);
    expect(screen.queryByText('Как получить билет?')).not.toBeInTheDocument();
  });

  it('calls makeReservationFunc on booking confirmation', () => {
    renderComponent();
    const bookButton = screen.getByText('Забронировать');
    fireEvent.click(bookButton);

    const confirmButton = screen.getByText('Да');
    fireEvent.click(confirmButton);

    expect(makeReservationFuncMock).toHaveBeenCalledWith(promotion);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it('calls cancelPromotion on cancellation confirmation', () => {
    renderComponent(true);
    const cancelButton = screen.getByText('Отказаться');
    fireEvent.click(cancelButton);

    const confirmButton = screen.getByText('Да');
    fireEvent.click(confirmButton);

    expect(cancelPromotionMock).toHaveBeenCalledWith(promotion);
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  // it('closes the modal on close icon click', () => {
  //   renderComponent();
  //   const closeIcon = screen.getByTestId('closeIcon');
  //   // screen.debug()
  //   userEvent.click(closeIcon);
  //   screen.debug()
  //   // expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  // });

  // it('renders contact person info if available', async () => {
  //   const contactPerson = {
  //     id: 1,
  //     name: 'Test User',
  //     tg_username: 'testuser',
  //     photo: 'https://test.com/photo.jpg',
  //   };



  //   const { getUserById } = require('../src/api/userApi');
  //   getUserById.mockResolvedValue(contactPerson);
 

  //   renderComponent();
  //   expect(await screen.findByText('Test User')).toBeInTheDocument();
  //   screen.debug()
  //   // await expect(screen.findByText('Контактное лицо')).toBeInTheDocument();
  //   // 
  // });
});