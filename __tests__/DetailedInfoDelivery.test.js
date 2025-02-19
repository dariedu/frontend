import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { DetailedInfoDelivery } from '../src/components/DetailedInfoDeliveryTask/DetailedInfoDelivery';
// import userEvent from '@testing-library/user-event';





 
  
describe('DetailedInfoDelivery', () => {
  const mockDelivery = {
    id: 2,
    date: "2025-02-09T17:00:00+03:00",
    curator: {
      id: 5,
      tg_id: '111',
      tg_username: "mgdata",
      last_name: "Петрова",
      name: "Мария",
      surname: "Геворговна",
      phone: '89086777777',
      photo: '',
      photo_view: null,
    },
    price: 2,
    is_free: true,
    is_active: true,
    location: {
      id: 4,
      address: 'ул. Ленина 15 кв 35',
      link: "",
      subway: "Марьина Роща",
      description: "справа красная дверь",
     city: {
        id: 1,
        city:'Москва'
      },
    },
    is_completed: false,
    in_execution: false,
    volunteers_needed: 5,
    volunteers_taken: 0,
  };
  
const mockOnOpenChange = jest.fn();
const mockSwitchTab = jest.fn();
const mockGetDelivery = jest.fn();
const mockStringForModal = 'строка для модального окна'
const mockTakeDeliverySuccess = false;
const mockSetTakeDeliverySuccess = jest.fn();
const mockCanBook = true
  
  const renderComponent = () => {
    return render(
      <DetailedInfoDelivery
        canBook={mockCanBook}
        delivery={mockDelivery}
        switchTab={mockSwitchTab}
        onOpenChange={mockOnOpenChange}
        getDelivery={mockGetDelivery}
        stringForModal={mockStringForModal}
        takeDeliverySuccess={mockTakeDeliverySuccess}
        setTakeDeliverySuccess={mockSetTakeDeliverySuccess}
      />    
    );
};

  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
    // Очищаем localStorage
    localStorage.clear();
  });

  it('should render component correctly', () => {
    renderComponent();
 const button = screen.getByText('Записаться');

    expect(screen.getByText('ул. Ленина 15 кв 35')).toBeInTheDocument();
    expect(screen.getByText("Марьина Роща")).toBeInTheDocument();
    expect(screen.getByText('Доставка')).toBeInTheDocument();
    expect(screen.getByText('Мария')).toBeInTheDocument();
    expect(screen.getByText('справа красная дверь')).toBeInTheDocument();
    expect(button).toHaveClass('btn-B-GreenDefault');
  });

  it('should render call getDeliveryFunction', async () => {
    renderComponent();
    const button = screen.getByText('Записаться');
    fireEvent.click(button);
    expect(await mockGetDelivery).toHaveBeenCalledWith(mockDelivery);
  });

  it('should show correct button name if avaliable for reservation', () => {
   

    render(
      <DetailedInfoDelivery
        canBook={false}
        delivery={mockDelivery}
        switchTab={mockSwitchTab}
        onOpenChange={mockOnOpenChange}
        getDlivery={mockGetDelivery}
        stringForModal={mockStringForModal}
        takeDeliverySuccess={mockTakeDeliverySuccess}
        setTakeDeliverySuccess={mockSetTakeDeliverySuccess}
      />    
    );

    const button = screen.getByText("Вы уже записались");
    expect(screen.getByText("Вы уже записались")).toBeInTheDocument();
    expect(button).toHaveClass('btn-B-WhiteDefault');
  })

  it('should show correct button name if all seats are taken', () => {
   
    const mockDelivery = {
      id: 2,
      date: "2025-02-09T17:00:00+03:00",
      curator: {
        id: 5,
        tg_id: '111',
        tg_username: "mgdata",
        last_name: "Петрова",
        name: "Мария",
        surname: "Геворговна",
        phone: '89086777777',
        photo: '',
        photo_view: null,
      },
      price: 2,
      is_free: false,
      is_active: true,
      location: {
        id: 4,
        address: 'ул. Ленина 15 кв 35',
        link: "",
        subway: "Марьина Роща",
        description: "справа красная дверь",
       city: {
          id: 1,
          city:'Москва'
        },
      },
      is_completed: false,
      in_execution: false,
      volunteers_needed: 5,
      volunteers_taken: 0,
    };
    render(
      <DetailedInfoDelivery
        canBook={true}
        delivery={mockDelivery}
        switchTab={mockSwitchTab}
        onOpenChange={mockOnOpenChange}
        getDlivery={mockGetDelivery}
        stringForModal={mockStringForModal}
        takeDeliverySuccess={mockTakeDeliverySuccess}
        setTakeDeliverySuccess={mockSetTakeDeliverySuccess}
      />    
    );
    const button = screen.getByText("Волонтёры найдены");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-B-GreenInactive');
    
  })

  it('should show cobfirm modal with info about taken delivery', () => {
   
    const mockTakeDeliverySuccess = true;
    render(
      <DetailedInfoDelivery
        canBook={true}
        delivery={mockDelivery}
        switchTab={mockSwitchTab}
        onOpenChange={mockOnOpenChange}
        getDlivery={mockGetDelivery}
        stringForModal={mockStringForModal}
        takeDeliverySuccess={mockTakeDeliverySuccess}
        setTakeDeliverySuccess={mockSetTakeDeliverySuccess}
      />    
    );
    expect(screen.getByText(`Доставка строка для модального окна в календаре`)).toBeInTheDocument();
  })

})