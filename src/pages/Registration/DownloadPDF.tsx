import React from 'react';

const DownloadPdfButton: React.FC = () => {
  // Функция для скачивания файла
  const handleDownloadPdf = () => {
    // URL файла PDF (может быть статическим или динамическим)

    const pdfUrl = 'https://cloud.mail.ru/public/c4Yr/MWBRTqPv5';
    // Используем Telegram WebApp API для скачивания файла
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openLink(pdfUrl);
    } else {
     console.log('Скачивание через Telegram Mini App недоступно.');
    }
  };

  return (
    <button onClick={handleDownloadPdf}>
      <p className="font-gerbera-h3 text-center text-light-brand-green font-normal" onClick={handleDownloadPdf} >Согласие</p>
    </button>
    
  );
};

export default DownloadPdfButton;