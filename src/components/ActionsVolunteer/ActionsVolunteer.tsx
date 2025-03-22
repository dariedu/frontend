import React, {useContext, useEffect, useState} from 'react';
import ThemeToggle from '../ui/ThemeToggle/ThemeToggle';
import CuratorIcon from '../../assets/icons/application_curator.svg?react';
import HistoryIcon from '../../assets/icons/history.svg?react';
import QuestionsIcon from '../../assets/icons/questions.svg?react';
import SupportIcon from '../../assets/icons/support.svg?react';
import DonateIcon from '../../assets/icons/donate.svg?react';
import InviteIcon from '../../assets/icons/invite_friend.svg?react';
import BeneficiaryIcon from '../../assets/icons/beneficiary.svg?react';
import AboutIcon from '../../assets/icons/about.svg?react';
import { getBallCorrectEndingName } from '../helperFunctions/helperFunctions';
import { getVolunteerDeliveries, type IVolunteerDeliveries } from '../../api/apiDeliveries';
import { TokenContext } from '../../core/TokenContext';
import ConfirmModal from '../ui/ConfirmModal/ConfirmModal';
import BecameCurator from '../BecameCurator/BecameCurator';
import { Modal } from '../ui/Modal/Modal';
import History from '../History/History';
import AboutMe from '../AboutMe/AboutMe';
import Suggestions from '../Suggestion/Suggestions';
import Support from '../Support/Support';


interface IAction {
  label: string
  icon: string | JSX.Element
  points?: string
  onClick?: () => void
}

interface IActionsVolunteerProps {
  visibleActions: string[];
  showThemeToggle: boolean;
  isVolunteer: boolean;
}

const ActionsVolunteer: React.FC<IActionsVolunteerProps> = ({
  visibleActions,
  showThemeToggle,
  isVolunteer
}) => {

  const {token} = useContext(TokenContext);  //// берем токен из юзер контекст
  const [myPast, setMyPast] = useState<number>(0);
  const [notEnoughtPointsOpenModal, setNotEnoughtPointsOpenModal] = useState(false);
  const [becameCuratorOpen, setBecameCuratorOpen] = useState(false);
  const [openHistoryPage, setOpenHistoryPage] = useState(false);
  const [openAboutMePage, setOpenAboutMePage] = useState(false);
  const [openSuggestionsPage, setOpenSuggestionsPage] = useState(false);
  const [openSupportPage, setOpenSupportPage] = useState(false);
/////проверяем сколько просшедших доставок у волонтера
  async function getMyDeliveries() {  
    try {
       if (token) {
         let result: IVolunteerDeliveries = await getVolunteerDeliveries(token);
         if (result) {
          let numPastDeliveries = result['мои завершенные доставки'].length
           setMyPast(numPastDeliveries)
         }
    }
    } catch (err) {
      console.log(err, "ActionsVolunteer getMyDeliveries fail")
    }
  }

  useEffect(() => {
    getMyDeliveries()
  },[])

  function becameCurator() {
    if (myPast < 3) {
      setNotEnoughtPointsOpenModal(true)
    } else {
      setBecameCuratorOpen(true)
  }
  }
  
  function openHistory() {
    setOpenHistoryPage(true)
  }
  function openAboutMe() {
    setOpenAboutMePage(true)
  }
  function openSuggestion() {
    setOpenSuggestionsPage(true)
  }
  function openSupport() {
    setOpenSupportPage(true)
  }


  // Все действия
  const actions: IAction[] = [
    {
      label: 'Подать заявку на должность куратора',
      icon: <CuratorIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>,
      onClick: becameCurator},
    { label: 'История', icon: <HistoryIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' />,  onClick: openHistory},
    { label: 'Обо мне', icon: <AboutIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>, onClick: openAboutMe}, 
    {
      label: 'Пригласить друга',
      icon: <InviteIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>,
      points: `+3 ${getBallCorrectEndingName(3)} `,
    },
    { label: 'Знаю того, кому нужна помощь', icon: <BeneficiaryIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' /> },
    { label: 'Сделать пожертвование', icon: <DonateIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' /> },
    { label: 'Вопросы и предложения', icon: <QuestionsIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black' />, onClick: openSuggestion },
    { label: 'Техническая поддержка', icon: <SupportIcon className='w-[42px] h-[42px] last:stroke-light-gray-white dark:last:stroke-light-gray-6 dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black'/>, onClick:openSupport },
  ];

  // Фильтруем действия для отображения
  const filteredActions = actions.filter(action =>
    visibleActions.includes(action.label),
  );

  return (
    <>
      <div className="space-y-1 bg-light-gray-1 dark:bg-light-gray-black rounded-2xl w-full max-w-[500px] mt-1">
      {/* Переключение темы */}
      {showThemeToggle && (
        <div className="relative rounded-2xl">
          <div className="flex items-center justify-between p-4 bg-light-gray-white h-[66px] rounded-2xl dark:bg-light-gray-7-logo" onClick={e=>e.preventDefault()}>
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Действия */}
      {filteredActions.map((action, index) => (

        <div  key={index} className="flex items-center justify-start p-4 bg-light-gray-white dark:bg-light-gray-7-logo rounded-[16px] h-[66px]" onClick={action.onClick ? action.onClick : ()=>{}}>
          <div className="flex items-center space-x-4">
              <span>{action.icon}</span>
            {/* )} */}
            <span className="text-left font-gerbera-h3 text-light-gray-black m-0 dark:text-light-gray-1">
              {action.label}
            </span>
          </div>
          {action.points && (
            <span className="font-gerbera-sub2 text-light-brand-green w-[129px]">
              {action.points}
            </span>
          )}
        </div>
      ))}
      </div>
      <ConfirmModal
        isOpen={notEnoughtPointsOpenModal}
        onOpenChange={setNotEnoughtPointsOpenModal}
        onConfirm={() => { setNotEnoughtPointsOpenModal(false)}}
      title={
        <p>
          Подать заявку можно после участия
          не менее, чем в трёх доставках<br/>
          в качестве волонтёра
        </p>
      }
      description=""
      confirmText="Ок"
        isSingleButton={true}
        zIndex={true}
      />
      <Modal isOpen={becameCuratorOpen} onOpenChange={setBecameCuratorOpen} zIndex={true}>
        <BecameCurator onOpenChange={setBecameCuratorOpen}/>
      </Modal>
       <Modal isOpen={openHistoryPage} onOpenChange={setOpenHistoryPage} zIndex={true}>
        <History onClose={setOpenHistoryPage} isVolunteer={isVolunteer} />
      </Modal>  
      <Modal isOpen={openAboutMePage} onOpenChange={setOpenAboutMePage} zIndex={true}>
        <AboutMe onClose={setOpenAboutMePage} />
      </Modal>  
      <Modal isOpen={openSuggestionsPage} onOpenChange={setOpenSuggestionsPage} zIndex={true}>
        <Suggestions onClose={setOpenSuggestionsPage} />
      </Modal>  
      <Modal isOpen={openSupportPage} onOpenChange={setOpenSupportPage} zIndex={true}>
        <Support onClose={setOpenSupportPage} />
      </Modal>  
    </>
    
  );
};

export default ActionsVolunteer;
