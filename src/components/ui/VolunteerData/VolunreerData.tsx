import React from 'react';

interface IVolunteerDataProps{
  geo: string,
  email: string,
  birthday: string,
  phone: string,
  telegram: string
}

interface ICreateComponentProps{
  item: string,
  iconsLink: string,
  changeIconLink?: string,
  key: number
}

const CreateComponent:React.FC<ICreateComponentProps> = ({ item, iconsLink, changeIconLink, key }) => {
  
  return (
    <div className='w-[360px] h-[66px] flex items-center justify-between px-3.5' key={key}>
      <div className='inline-flex items-center justify-start'>
      <img src={iconsLink} className='w-[42px] h-[42px]' key={key}/>
        <p key={key} className='ml-3.5'>{item}</p>
      </div>
      
      {changeIconLink ? <img src={changeIconLink} className='w-[42px] h-[42px] cursor-pointer' key={key} /> : "" }
    </div>
  )


 }

export const VolunteerData: React.FC<IVolunteerDataProps> = ({geo, email, birthday, phone, telegram}) => {
  const items = [geo, email, birthday, phone, telegram]
  const iconsLinks = ['./../src/assets/icons/geo.svg','./../src/assets/icons/email.svg', './../src/assets/icons/birthday.svg', './../src/assets/icons/phone.svg', './../src/assets/icons/telegram.svg',]
  const changeIconLink = './../src/assets/icons/big_pencil.svg';


  return (
    <>
      <div className='w-[360px] h-[410px] bg-light-gray-white flex flex-col justify-between'>
        {items.map((item, index) => {
          if (index === 4) {
            return <CreateComponent item={item} iconsLink={iconsLinks[index]} key={index} />
          } else {
          return <CreateComponent item={item} iconsLink={iconsLinks[index]} changeIconLink={changeIconLink} key={index} />  
          }
         
        })}
      </div>
    </>
  )
}