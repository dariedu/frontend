import CloseIcon from "../../assets/icons/closeIcon.svg?react"


const CreateTelegramNik = ({onOpenChange}:{onOpenChange:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className="z-[56] concentTopersonalData bg-light-gray-white rounded-t-2xl w-full h-full max-w-[500px]  flex flex-col p-6 items-center dark:bg-light-gray-7-logo " onClick={e=>e.stopPropagation()} >
      <CloseIcon className='fill-light-gray-3 w-8 h-8 min-w-8 min-h-8 self-end mb-2' onClick={()=>onOpenChange(false)} />
      <h1 className="font-gerbera-h1 text-light-gray-black mb-8 text-center dark:text-light-gray-1">Как создать имя пользователя в Telegram?</h1> 
      <p className="font-gerbera-h3 text-light-gray-7-logo text-justify px-2 dark:text-light-gray-3">Для того, чтобы сделать себе имя пользователя в Telegram (то, что пишется на латинице после «@», например,  <a href={'https://t.me/volunteers_dari_edu'} target="_blank" className='text-light-brand-green '>
                @volunteers_dari_edu
                </a>) необходимо:</p>
      <br /><br />
      <p className="font-gerbera-h3 text-light-gray-7-logo text-justify px-2 dark:text-light-gray-3">
        Зайти в настройки телеграм (правый нижний угол), далее в правом верхнем углу нажать «Изм.», найти строку «Имя пользователя» и ввести желаемое имя латинскими буквами.<br/><br/><br /><br />
        После попробуйте заново зайти в приложение <a href={'https://t.me/DariEduFundBot'} target="_blank" className='text-light-brand-green '>
        @DariEduFundBot </a>  и зарегистрироваться.</p>
    </div>
  )
}

export default CreateTelegramNik;