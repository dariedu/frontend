import React from 'react';
import RegistrationForm from '../Registration/RegistrationPage';
import CuratorPage from '../Curator/CuratorPage';
// import VolunteerPage from '../Volunteer/VolunteerPage';

// Пример данных о пользователе (их нужно заменить на реальные данные из вашего источника)
const user = {
  id: null, // или id пользователя, если зарегистрирован
  is_staff: false, // true если curator, false если volunteer
};

const MainPage: React.FC = () => {
  // Если пользователь не зарегистрирован (id нет в базе)
  if (!user.id) {
    return <RegistrationForm />;
  }

  // Если пользователь - куратор
  if (user.is_staff) {
    return <CuratorPage />;
  }

  // Если пользователь - волонтер
  // return <VolunteerPage />;
};

export default MainPage;
