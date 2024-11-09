export const getTelegramParams = () => {
  if (window.Telegram?.WebApp?.initDataUnsafe) {
    const initData = window.Telegram.WebApp.initDataUnsafe;

    return {
      phone: initData.user?.phone_number || null,
      tgId: initData.user?.id || null,
      tgUsername: initData.user?.username || null,
    };
  }

  return {
    phone: null,
    tgId: null,
    tgUsername: null,
  };
};

//phone_number=79086851174&tg_id=1567882993&tg_nickname=@MGdata