export const getTelegramParams = () => {
  console.log('Получаем параметры из Telegram Web App');

  if (window.Telegram?.WebApp?.initDataUnsafe) {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    console.log('initData:', initData);

    return {
      phone: initData.user?.phone_number || null,
      tgId: initData.user?.id || null,
      tgUsername: initData.user?.username || null,
    };
  }

  console.log('initDataUnsafe недоступен');
  return {
    phone: null,
    tgId: null,
    tgUsername: null,
  };
};
