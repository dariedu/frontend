import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface IModalProps{
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
  noColor?: boolean
  zIndex?:boolean
  //setCancelDeliverySuccess?:React.Dispatch<React.SetStateAction<boolean>>
}

export const Modal: React.FC<IModalProps> = ({ isOpen, onOpenChange, children, noColor=false, zIndex=false}) =>{



  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}  >
        <Dialog.Portal>
          {zIndex ? (
          <>
    <Dialog.Overlay className={ noColor ? "z-[51] fixed inset-0" : "z-[51] fixed inset-0 bg-black opacity-30"  } />
    <Dialog.Content className={noColor ? "z-[51] fixed inset-0 flex items-end justify-center" : "z-[51] fixed inset-0 flex items-end backdrop-blur-[2px] justify-center"}  onClick={() => onOpenChange(false)}>
      <Dialog.Title></Dialog.Title>
      <Dialog.Description></Dialog.Description>
      {children}
    </Dialog.Content>
        </>
          ) : (
              <>
          <Dialog.Overlay className={ noColor ? "fixed inset-0" : "fixed inset-0 bg-black opacity-30"  } />
          <Dialog.Content className={noColor ? "fixed inset-0 flex items-end justify-center" : "fixed inset-0 flex items-end backdrop-blur-[2px] justify-center"}  onClick={() => onOpenChange(false)}>
            <Dialog.Title></Dialog.Title>
            <Dialog.Description></Dialog.Description>
            {children}
        </Dialog.Content>
              </>
           )}  
         
      </Dialog.Portal>
    </Dialog.Root>
    </>
  )
  
}