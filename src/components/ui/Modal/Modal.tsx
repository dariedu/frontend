// import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface IModalProps{
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  onOpenChangeComment?: ()=>void
  children: React.ReactNode
  noColor?: boolean
  zIndex?: boolean
  //setCancelDeliverySuccess?:React.Dispatch<React.SetStateAction<boolean>>
}

export const Modal: React.FC<IModalProps> = ({ isOpen, onOpenChange, onOpenChangeComment, children, noColor=false, zIndex=false}) =>{



  return (
isOpen &&
    <div onClick={() => { onOpenChange(false);  onOpenChangeComment ? onOpenChangeComment(): ()=>{}}} >
        <div onClick={() => { onOpenChange(false);  onOpenChangeComment ? onOpenChangeComment(): ()=>{}}}>
          {zIndex ? (
          <>
    <div className={ noColor ? " text-left z-[51] fixed inset-0" : "z-[51] fixed inset-0 bg-black opacity-30"  } />
    <div className={noColor ? " text-left z-[51] fixed inset-0 flex items-end justify-center" : "text-left z-[51] fixed inset-0 flex items-end backdrop-blur-[2px] justify-center"}  onClick={() => onOpenChange(false)}>
      {children}
    </div>
        </>
          ) : (
              <>
          <div className={ noColor ? " text-left fixed inset-0" : "fixed inset-0 bg-black opacity-30"  } />
          <div className={noColor ? " text-left z-[2] fixed inset-0 flex items-end justify-center" : "text-left z-[2] fixed inset-0 flex items-end backdrop-blur-[2px] justify-center"}  onClick={() => onOpenChange(false)}>
            {children}
        </div>
              </>
           )}  
         
      </div>
    </div>
  )
  
}