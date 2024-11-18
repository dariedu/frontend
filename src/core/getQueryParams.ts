export const getTelegramParams = () => {
  if (window.Telegram?.WebApp?.initDataUnsafe) {
    const initData = window.Telegram.WebApp.initDataUnsafe;

    return {
      tgId: initData.user?.id || null,
      tgUsername: initData.user?.username || null,
      colorScheme: window.Telegram?.WebApp?.colorScheme|| null
    };
  }

  return {
    tgId: null,
    tgUsername: null,
    colorScheme: window.Telegram?.WebApp?.colorScheme || null,
  };
};
