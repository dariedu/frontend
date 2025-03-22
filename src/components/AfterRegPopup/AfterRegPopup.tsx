import DownloadPdfButton from "../../pages/Registration/DownloadPDF";
import CloseIcon from "../../assets/icons/newCross.svg?react"
import Bread from './../../assets/icons/bread.svg?react';

type TAfterRegPopup = {
  onClose: React.Dispatch<React.SetStateAction<boolean>>,
}



const AfterRegPopup: React.FC<TAfterRegPopup> = ({ onClose }) => { 


  return <div className="w-[300px] h-[336px] bg-light-gray-white pb-4 px-4 pt-[20px] dark:bg-light-gray-7-logo text-center rounded-2xl self-center flex flex-col justify-between items-center" onClick={e=>e.stopPropagation()}>
    <CloseIcon className='absolute stroke-light-gray-3 w-8 h-8 min-w-8 min-h-8 self-end mb-2' onClick={() => onClose(false)} />
     <Bread className='fill-[#000000] dark:fill-[#F8F8F8] min-h-[41px] min-w-[57px] '/>
    <div className="font-gerbera-h3 text-light-gray-7-logo dark:text-light-gray-white mt-4 ">Для завершения регистрации одному из ваших родителей / официальному опекуну необходимо дать {" "}
      <DownloadPdfButton /><br/>
      {/* <a href="https://cloud.mail.ru/public/c4Yr/MWBRTqPv5" target="_blank" download={"document.pdf"} className="font-gerbera-h3 text-center text-light-brand-green font-normal">Согласие</a> */}
      на ваше участие в благотворительных доставках и других добрых делах.
      <p className="font-gerbera-sub1 text-light-gray-3 mt-4">Заполненный и подписанный и документ отправьте нам в Telegram.</p>
    </div> 
    <div className="w-[232px] flex justify-between mt-4 self-center">
    <a href="https://cloud.mail.ru/public/c4Yr/MWBRTqPv5"  target="_blank" download={"document.pdf"} className="btn-S-GreenRevert flex items-center justify-center" >Согласие</a>
    <a href={'https://t.me/volunteers_dari_edu'} className="btn-S-GreenDefault flex items-center justify-center" target="_blank"  >Отправить</a>
      </div>
  </div>
}

export default AfterRegPopup;