import React, { createContext, useContext, useState, ReactNode } from 'react';

// Определяем интерфейс для типов данных, которые будем хранить в контексте
interface IAppContext {
  currentUserId: number | null;
  setCurrentUserId: (id: number | null) => void;
  isRouteSheetsOpen: boolean;
  setIsRouteSheetsOpen: (open: boolean) => void;
}

// Создаем сам контекст
const AppContext = createContext<IAppContext | undefined>(undefined);

// Создаем компонент провайдера, который будет оборачивать все приложение
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Состояние для хранения ID текущего пользователя
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Состояние для открытия/закрытия окна RouteSheets
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        isRouteSheetsOpen,
        setIsRouteSheetsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования контекста в компонентах
export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
