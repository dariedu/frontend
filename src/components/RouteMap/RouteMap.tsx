import React, { useEffect, useRef, useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';

interface RouteInfo {
  time: string;
  distance: string;
  steps: number;
}

const RouteMap: React.FC = () => {
  const mapRef = useRef<ymaps.Map | null>(null); // Реф для хранения экземпляра карты
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null); // Состояние для хранения информации о маршруте

  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = mapRef.current;

    // Создаем маршрутизатор
    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [
          'Москва, Красная площадь',
          'Москва, метро Третьяковская',
        ], // Начальная и конечная точки
        params: {
          routingMode: 'pedestrian', // Используем режим "пешеходный"
        },
      },
      {
        boundsAutoApply: true, // Автоматически подстраивать карту под маршрут
      },
    );

    mapInstance.geoObjects.add(multiRoute);

    // Слушаем событие успешного построения маршрута
    multiRoute.model.events.add('requestsuccess', function () {
      const activeRoute = multiRoute.getActiveRoute();
      if (activeRoute) {
        // Извлекаем информацию о маршруте
        const length = activeRoute.properties.get('distance').text;
        const duration = activeRoute.properties.get('duration').text;
        const steps = Math.floor(
          activeRoute.properties.get('distance').value / 0.75,
        ); // Пример подсчета шагов

        // Обновляем состояние для отображения информации о маршруте
        setRouteInfo({
          time: duration,
          distance: length,
          steps: steps,
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>Карта с инструментами маршрута</h1>
      <YMaps query={{ apikey: 'YOUR_YANDEX_MAP_API_KEY' }}>
        {' '}
        {/* Замените YOUR_YANDEX_MAP_API_KEY на ваш ключ API */}
        <Map
          defaultState={{
            center: [55.751244, 37.618423], // Центр карты
            zoom: 9, // Уровень зума
          }}
          width="100%" // Ширина карты
          height="500px" // Высота карты
          instanceRef={mapRef} // Привязка рефа к компоненту карты
          modules={['multiRouter.MultiRoute']} // Модуль для построения маршрутов
        />
      </YMaps>

      {/* Отображение информации о маршруте */}
      {routeInfo && (
        <div className="route-info">
          <h2>Информация о маршруте</h2>
          <p>Время в пути: {routeInfo.time}</p>
          <p>Расстояние: {routeInfo.distance}</p>
          <p>Количество шагов: {routeInfo.steps}</p>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
