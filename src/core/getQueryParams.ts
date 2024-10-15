export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    phone: params.get('phone_number'),
    tgId: params.get('tg_id'),
    tgUsername: params.get('tg_nickname'),
  };
};
