import React, { useState, useEffect } from 'react';
import { IRouteSheet } from '../../api/routeSheetApi';
import Arrow_down from './../../assets/icons/arrow_down.svg?react';
import AvatarIcon from '../../assets/route_sheets_avatar.svg?react';
import ListOfVolunteers from '../ListOfVolunteers/ListOfVolunteers';
import RouteSheetsView from './RouteSheetsViewCurator';
import Small_sms from './../../assets/icons/small_sms.svg?react';
import * as Avatar from '@radix-ui/react-avatar';
import { Modal } from '../ui/Modal/Modal';
import { TVolunteerForDeliveryAssignments } from '../../api/apiDeliveries';
import { type TServerResponsePhotoReport } from '../../api/apiPhotoReports';

interface IfilteredRouteSheet extends IRouteSheet {
  volunteerFullName?: string;
  telegramNik?: string;
}

interface IProps {
  routeS: IfilteredRouteSheet;
  index: number;
  setOpenVolunteerLists: React.Dispatch<React.SetStateAction<boolean[]>>;
  listOfVolunteers: TVolunteerForDeliveryAssignments[];
  listOfConfirmedVol: number[] | null;
  openVolunteerLists: boolean[];
  changeListOfVolunteers: React.Dispatch<
    React.SetStateAction<TVolunteerForDeliveryAssignments[]>
  >;
  onVolunteerAssign: (
    volunteerId: number,
    deliveryId: number,
    routeSheetId: number,
  ) => Promise<void>;
  deliveryId: number;
  assignVolunteerFail: boolean;
  setAssignVolunteerFail: React.Dispatch<React.SetStateAction<boolean>>;
  assignVolunteerSuccess: boolean;
  setAssignVolunteerSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  openRouteSheets: boolean[];
  setOpenRouteSheets: React.Dispatch<React.SetStateAction<boolean[]>>;
  myPhotoReports: TServerResponsePhotoReport[];
  sendPhotoReportSuccess: boolean;
  setSendPhotoReportSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const RouteSheet: React.FC<IProps> = ({
  routeS,
  index,
  setOpenVolunteerLists,
  listOfVolunteers,
  listOfConfirmedVol,
  openVolunteerLists,
  changeListOfVolunteers,
  onVolunteerAssign,
  deliveryId,
  assignVolunteerFail,
  setAssignVolunteerFail,
  assignVolunteerSuccess,
  setAssignVolunteerSuccess,
  openRouteSheets,
  setOpenRouteSheets,
  myPhotoReports,
  sendPhotoReportSuccess,
  setSendPhotoReportSuccess,
}) => {
  const [finished, setFinished] = useState(false);
  const [thisRouteMyPhotoReports, setThisRouteMyPhotoReports] = useState<
    TServerResponsePhotoReport[]
  >([]);

  function filterPhotoReports() {
    if (
      myPhotoReports &&
      myPhotoReports.length > 0 &&
      routeS.address.length > 0
    ) {
      let filtered = myPhotoReports.filter(report => {
        if (report.route_sheet_id == routeS.address[0].route_sheet)
          return report;
      });
      setThisRouteMyPhotoReports(filtered);
    }
  }

  useEffect(() => {
    filterPhotoReports();
  }, [myPhotoReports]);

  useEffect(() => {
    if (
      routeS.address.length > 0 &&
      thisRouteMyPhotoReports.length == routeS.address.length
    ) {
      setFinished(true);
      console.log('all photo uploaded', routeS.address[0].id);
    }
  }, [myPhotoReports]);

  return (
    <div
      key={routeS.id}
      className={`mb-1 rounded-xl bg-light-gray-white dark:bg-light-gray-7-logo min-h-[124px] flex flex-col justify-around 
      `}
    >
      <div className={`${finished ? 'opacity-70' : ''}`}>
        {finished && (
          <div className="font-gerbera-h3 text-light-gray-8-text dark:text-light-gray-white self-center text-center mt-2 ">
            Волонтёр загрузил все фотоотчеты!
          </div>
        )}
        <div className="flex items-center justify-between w-full mb-2 p-4">
          <span className="font-gerbera-h3 text-light-gray-5 dark:text-light-gray-4">
            {`Маршрут: ${routeS.name}`}
            <br />
            {`Обедов к доставке: ${routeS.dinners}`}
          </span>
          <div
            className="w-6 h-6 cursor-pointer"
            onClick={() =>
              setOpenRouteSheets(prev =>
                prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen)),
              )
            }
          >
            <Arrow_down
              className={`mt-2 stroke-[#D7D7D7] dark:stroke-[#575757] cursor-pointer  ${openRouteSheets[index] ? 'transform rotate-180' : ''}`}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div
            className="flex w-full items-center cursor-pointer"
            onClick={() =>
              setOpenVolunteerLists(prev =>
                prev.map((isOpen, idx) =>
                  idx === index ? (isOpen ? false : true) : isOpen,
                ),
              )
            }
          >
            <div className="font-gerbera-h3 text-light-gray-8 w-full flex justify-between px-4 pb-4 ">
              <div className="flex w-full justify-between items-center text-light-gray-black dark:text-light-gray-white">
                {routeS.volunteerFullName ? (
                  <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-8 h-8 min-w-8 min-h-8 rounded-full bg-light-gray-2 dark:bg-light-gray-5">
                    <Avatar.Image
                      className="w-[40px] h-[40px] object-cover"
                      src={
                        listOfVolunteers.find(
                          i => i.tg_username == routeS.telegramNik,
                        )?.photo
                      }
                    />
                    <Avatar.Fallback
                      className="w-8 h-8 min-w-8 min-h-8 flex items-center justify-center text-black bg-light-gray-1 dark:text-white dark:bg-black"
                      delayMs={600}
                    >
                      {routeS.volunteerFullName?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                ) : (
                  <AvatarIcon />
                )}

                {routeS.volunteerFullName &&
                routeS.volunteerFullName.length > 0 ? (
                  <p className="ml-3 w-full">{routeS.volunteerFullName}</p>
                ) : (
                  <p className="ml-3 w-full">Не выбран</p>
                )}
                {routeS.telegramNik && routeS.telegramNik.length > 0 ? (
                  <a
                    href={
                      'https://t.me/' +
                      (routeS.telegramNik.includes('@')
                        ? routeS.telegramNik.slice(1)
                        : routeS.telegramNik)
                    }
                    target="_blank"
                    onClick={e => e.stopPropagation()}
                  >
                    <Small_sms className="w-[36px] h-[35px]" />
                  </a>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openVolunteerLists[index] && (
        <Modal
          isOpen={openVolunteerLists[index]}
          onOpenChange={() => {
            setOpenVolunteerLists(prev =>
              prev.map((isOpen, idx) =>
                idx === index ? (isOpen ? false : true) : isOpen,
              ),
            );
          }}
        >
          <ListOfVolunteers
            listOfVolunteers={listOfVolunteers}
            listOfConfirmedVol={listOfConfirmedVol}
            changeListOfVolunteers={changeListOfVolunteers}
            onOpenChange={() => {
              setOpenVolunteerLists(prev =>
                prev.map((isOpen, idx) =>
                  idx === index ? (isOpen ? false : true) : isOpen,
                ),
              );
            }}
            showActions={true}
            onVolunteerAssign={onVolunteerAssign}
            deliveryId={deliveryId}
            routeSheetName={`Маршрутный лист: ${routeS.name}`}
            routeSheetId={routeS.id}
            setAssignVolunteerFail={setAssignVolunteerFail}
            setAssignVolunteerSuccess={setAssignVolunteerSuccess}
            assignVolunteerFail={assignVolunteerFail}
            assignVolunteerSuccess={assignVolunteerSuccess}
            assignedVolunteerName={routeS.volunteerFullName}
          />
        </Modal>
      )}
      {openRouteSheets[index] && (
        <RouteSheetsView
          routes={routeS.address.map(addr => addr)}
          myPhotoReports={thisRouteMyPhotoReports}
          deliveryId={deliveryId}
          routeSheetId={routeS.id}
          sendPhotoReportSuccess={sendPhotoReportSuccess}
          setSendPhotoReportSuccess={setSendPhotoReportSuccess}
        />
      )}
    </div>
  );
};

export default RouteSheet;
