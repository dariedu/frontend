import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import MainPageCurator from '../../pages/Curator/MainPageCurator/MainPageCurator';
import CalendarCurator from '../../pages/Curator/CalendarPageCurator/CalendarCurator';
import './index.css';

import HomeIcon from '../../assets/icons/tap_home.svg';
import HomeIconActive from '../../assets/icons/tap_homeActive.svg';
import CalendarIcon from '../../assets/icons/tap_calendar.svg';
import CalendarIconActive from '../../assets/icons/tap_calendarActive.svg';
import CuratorIcon from '../../assets/icons/curator.svg';
import CuratorIconActive from '../../assets/icons/curatorActive.svg';
import BonusesIcon from '../../assets/icons/bonus.svg';
import BonusesIconActive from '../../assets/icons/bonusActive.svg';
import Curator from '../../pages/Curator/Curator/Curator';

//////volunteer
import MainTabVolunteer from '../../pages/Volunteer/MainTabVolunteer/MainTabVolunteer';
import CalendarTabVolunteer from '../../pages/Volunteer/CalendarTabVolunteer/CalendarTabVolunteer';
import BankTab from '../../pages/Volunteer/BankTabVolunteer/BankTab';
//////volunteer

interface ITabBarProps {
  userRole: 'curator' | 'volunteer';
}

const TabBar: React.FC<ITabBarProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<string>('tab1');

  return (
    <div className="relative w-[360px] min-h-[746px]">
      <Tabs.Root
        className="TabsRoot"
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value)}
      >
        {/* Контент вкладок */}
        {userRole === 'curator' ? (
          <>
            <Tabs.Content value="tab1" className="TabsContent">
              <MainPageCurator />
            </Tabs.Content>
            <Tabs.Content value="tab2" className="TabsContent">
              <CalendarCurator />
            </Tabs.Content>
            <Tabs.Content value="tab3" className="TabsContent">
              <Curator />
            </Tabs.Content>
            <Tabs.Content value="tab4" className="TabsContent">
              <BankTab />
            </Tabs.Content>
          </>
        ) : (
          <>
            <Tabs.Content value="tab1" className="TabsContent">
              <MainTabVolunteer switchTab={setActiveTab} />
            </Tabs.Content>
            <Tabs.Content value="tab2" className="TabsContent">
              <CalendarTabVolunteer />
            </Tabs.Content>
            <Tabs.Content value="tab4" className="TabsContent">
              <BankTab />
            </Tabs.Content>
          </>
        )}

        <Tabs.List className="flex justify-between fixed bottom-0 w-[360px] h-[74px]">
          {/* Вкладка "Главная" */}
          <Tabs.Trigger
            value="tab1"
            className={classNames('flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-dark-gray-white w-full', {
              'text-light-brand-green': activeTab === 'tab1',
              'text-light-gray-4': activeTab !== 'tab1',
            })}
          >
            <img
              src={activeTab === 'tab1' ? HomeIconActive : HomeIcon}
              alt="Главная"
              className="w-6 h-6"
            />
            <span
              className={classNames('mt-1 text-xs', {
                'text-light-brand-green': activeTab === 'tab1',
                'text-light-gray-4': activeTab !== 'tab1',
              })}
            >
              Главная
            </span>
          </Tabs.Trigger>

          {/* Вкладка "Календарь" */}
          <Tabs.Trigger
            value="tab2"
            className={classNames('flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-dark-gray-white w-full', {
              'text-light-brand-green': activeTab === 'tab2',
              'text-light-gray-4': activeTab !== 'tab2',
            })}
          >
            <img
              src={activeTab === 'tab2' ? CalendarIconActive : CalendarIcon}
              alt="Календарь"
              className="w-6 h-6"
            />
            <span
              className={classNames('mt-1 text-xs', {
                'text-light-brand-green': activeTab === 'tab2',
                'text-light-gray-4': activeTab !== 'tab2',
              })}
            >
              Календарь
            </span>
          </Tabs.Trigger>

          {/* Вкладка "Куратор" */}
          {userRole === 'curator' && (
            <Tabs.Trigger
              value="tab3"
              className={classNames('flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-dark-gray-white w-full', {
                'text-light-brand-green': activeTab === 'tab3',
                'text-light-gray-4': activeTab !== 'tab3',
              })}
            >
              <img
                src={activeTab === 'tab3' ? CuratorIconActive : CuratorIcon}
                alt="Куратор"
                className="w-6 h-6"
              />
              <span
                className={classNames('mt-1 text-xs', {
                  'text-light-brand-green': activeTab === 'tab3',
                  'text-light-gray-4': activeTab !== 'tab3',
                })}
              >
                Куратор
              </span>
            </Tabs.Trigger>
          )}

          {/* Вкладка "Моя копилка" */}
          <Tabs.Trigger
            value="tab4"
            className={classNames('flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-dark-gray-white w-full', {
              'text-light-brand-green': activeTab === 'tab4',
              'text-light-gray-4': activeTab !== 'tab4',
            })}
          >
            <img
              src={activeTab === 'tab4' ? BonusesIconActive : BonusesIcon}
              alt="Моя копилка"
              className="w-6 h-6"
            />
            <span
              className={classNames('mt-1 text-xs', {
                'text-light-brand-green': activeTab === 'tab4',
                'text-light-gray-4': activeTab !== 'tab4',
              })}
            >
              Моя копилка
            </span>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

export default TabBar;
