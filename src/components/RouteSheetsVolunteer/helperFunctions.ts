import { TPhotoReport } from '../../api/apiPhotoReports';
import { postPhotoReport } from '../../api/apiPhotoReports';
import { TAddress } from '../../api/routeSheetApi';

async function submitPhotoReport(index: number, currentUser: any, token: string | null,
  setSendMessage: React.Dispatch<React.SetStateAction<string>>,
  setUnactive: React.Dispatch<React.SetStateAction<("Отправить" | "Отправка" | "Отправлен")[]>>,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>, routeSheetId:number, deliveryId:number, routes:TAddress[], 
  files: Blob, comment: string, beneficiarIsAbsent: boolean, setSendPhotoReportSuccess: React.Dispatch<React.SetStateAction<boolean>>, 
  setErrorMessage:React.Dispatch<React.SetStateAction<string>>,  setSendPhotoReportFail:React.Dispatch<React.SetStateAction<boolean>>
) {
  if (currentUser && token) {
    setUnactive(prev =>
      prev.map((string, idx) => (idx === index ? 'Отправка' : string)),
    );
    setSendMessage('');
    setIsSending(true);
    const obj: TPhotoReport = {
      photo: files,
      comment: comment,
      route_sheet_id: routeSheetId,
      delivery_id: deliveryId,
      address: routes[index].id,
      is_absent: beneficiarIsAbsent,
    };


    if (files && currentUser) {
      const formData = new FormData();
      for (let key in obj) {
        if (key == 'photo') {
          formData.append('photo', files);
        } else if (key == 'is_absent') {
          formData.set(
            'is_absent',
            String(beneficiarIsAbsent ? 'True' : 'False'),
          );
        } else {
          const typedKey = key as keyof TPhotoReport | keyof typeof obj;
          formData.set(typedKey, String(obj[typedKey]));
        }
      }
      // Создаем AbortController для установки таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // Таймаут 20 секунд

      try {
        await postPhotoReport(token, formData, controller.signal);
        setSendMessage(routes[index].address);
        setSendPhotoReportSuccess(true);
        setUnactive(prev =>
          prev.map((string, idx) => (idx === index ? 'Отправлен' : string)),
        );
        localStorage.removeItem(`comment${routes[index].beneficiar[0].id}`);
      } catch (err: any) {
        if (err == 'Error: AxiosError: Network Error') {
          setErrorMessage(
            'Возникла проблема с интернет соединением. Возможно фотография слишком тяжелая, попробуйте выбрать фото меньшего размера и попробуйте снова отправить фотоотчет',
          );
        } else if (
          err == 'Error: Данный токен недействителен для любого типа токена'
        ) {
          setErrorMessage(
            'Возникла ошибка авторизации, пожалуйста обновите страницу и попробуйте снова отправить фотоотчет',
          );
        } else if (err == 'Error: CanceledError: canceled') {
          console.log('Загрузка прервана из-за слабого интернет соединения');
          setErrorMessage(
            'Загрузка прервана из-за слабого интернет соединения',
          );
        }
        setSendPhotoReportFail(true);
        setUnactive(prev =>
          prev.map((string, idx) => (idx === index ? 'Отправить' : string)),
        );
      } finally {
        clearTimeout(timeoutId);
        setIsSending(false);
      }
    }
  }
}

export { submitPhotoReport}