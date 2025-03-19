import CloseIcon from "../../assets/icons/closeIcon.svg?react"


const CreateTelegramNik = ({onOpenChange}:{onOpenChange:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className="z-[56] concentTopersonalData bg-light-gray-white rounded-t-2xl w-full h-full max-w-[500px]  flex flex-col p-6 items-center dark:bg-light-gray-7-logo " onClick={e=>e.stopPropagation()} >
      <CloseIcon className='fill-light-gray-3 w-8 h-8 min-w-8 min-h-8 self-end mb-2' onClick={()=>onOpenChange(false)} />
      <h1 className="font-gerbera-h1 text-light-gray-black mb-8 text-center dark:text-light-gray-1">Как создать имя пользователя в Telegram?</h1> 
      <p className="font-gerbera-h3 text-light-gray-7-logo text-justify px-2 dark:text-light-gray-3">Пишется на латинице после «@», например,  <a href={'https://t.me/volunteers_dari_edu'} target="_blank" className='text-light-brand-green italic'>
                @volunteers_dari_edu
                </a></p>
      <br /><br />
      <p className="font-gerbera-h3 text-light-gray-7-logo text-justify px-2 dark:text-light-gray-3">
        1. Зайти в настройки Telegram (правый нижний угол)<br/><br/>
        2. В правом верхнем углу нажать «Изм.» <br /><br/>
        3. Найти строку «Имя пользователя»<br /><br/>
        4. Ввести жалаемое имя латинскими буквами, оно должно быть уникальным. Следуйте подсказкам Telegram при выборе имени.<br /><br/><br/>
        После зайдите в приложение <a href={'https://t.me/DariEduFundBot'} target="_blank" className='text-light-brand-green '>
        @DariEduFundBot </a> заново и зарегистрируйтесь.
        </p>
    </div>
  )



// 1. зайти в настройки Telegram (правый нижний угол)

// 2. в правом верхнем углу нажать «Изм.»

// 3. найти строку «Имя пользователя»

// 4. ввести жалаемое имя латинскими буквами, оно должно быть уникальным. Следуйте подсказкам Telegram при выборе имени.

// После зайдите в приложение @DariEduFundBot заново и зарегистрируйтесь.
}

export default CreateTelegramNik;