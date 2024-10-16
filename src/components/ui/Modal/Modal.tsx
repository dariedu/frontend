import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface IModalProps{
  isOpen: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}

export const Modal:React.FC<IModalProps> = ({isOpen, onOpenChange, children}) =>{

  return (
    <>
       <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Content className="fixed inset-0 flex items-end backdrop-blur-[2px]" onClick={() => onOpenChange(false)}>
            <Dialog.Title></Dialog.Title>
            <Dialog.Description></Dialog.Description>
            {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    </>
  )
  
}