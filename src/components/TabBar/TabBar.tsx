import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';

import HomeIcon from '../../assets/icons/tap_home.svg?react';
import CalendarIcon from '../../assets/icons/tap_calendar.svg?react';
import CuratorIcon from '../../assets/icons/curator.svg?react';
import BonusesIcon from '../../assets/icons/bonus.svg?react';
import CuratorTab from '../../pages/Curator/CuratorTab/CuratorTab';

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
    <div className="relative w-full max-w-[500px] self-center">
      <Tabs.Root
        className="TabsRoot"
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value)}
      >
        {/* Контент вкладок */}
        {userRole === 'curator' ? (
          <>
            <Tabs.Content value="tab1" className="TabsContent">
              <MainTabVolunteer switchTab={setActiveTab} />
            </Tabs.Content>
            <Tabs.Content value="tab2" className="TabsContent">
              <CalendarTabVolunteer />
            </Tabs.Content>
            <Tabs.Content value="tab3" className="TabsContent">
              <CuratorTab />
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
        <Tabs.List className="flex justify-between fixed bottom-0 w-full max-w-[500px] h-[74px]">
          {/* Вкладка "Главная" */}
          <Tabs.Trigger
            value="tab1"
            className={classNames(
              'flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo w-full max-w-[500px]',
              {
                'text-light-brand-green': activeTab === 'tab1',
                'text-light-gray-4': activeTab !== 'tab1',
              },
            )}
          >
            <HomeIcon
              className={`${activeTab === 'tab1' ? 'fill-light-brand-green' : 'fill-light-gray-3 dark:fill-light-gray-4 '}`}
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
            className={classNames(
              'flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo w-full max-w-[500px]',
              {
                'text-light-brand-green': activeTab === 'tab2',
                'text-light-gray-4': activeTab !== 'tab2',
              },
            )}
          >
            <CalendarIcon
              className={`${activeTab === 'tab2' ? 'fill-light-brand-green' : 'fill-light-gray-3 dark:fill-light-gray-4 '}`}
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
              className={classNames(
                'flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo w-full max-w-[500px]',
                {
                  'text-light-brand-green': activeTab === 'tab3',
                  'text-light-gray-4': activeTab !== 'tab3',
                },
              )}
            >
              <CuratorIcon
                className={`${activeTab === 'tab3' ? 'fill-light-brand-green' : 'fill-light-gray-3 dark:fill-light-gray-4 '}`}
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
            className={classNames(
              'flex flex-col items-center p-2 rounded-t-2xl bg-light-gray-white dark:bg-light-gray-7-logo w-full max-w-[500px]',
              {
                'text-light-brand-green': activeTab === 'tab4',
                'text-light-gray-4': activeTab !== 'tab4',
              },
            )}
          >
            <BonusesIcon
              className={`${activeTab === 'tab4' ? 'fill-light-brand-green' : 'fill-light-gray-3 dark:fill-light-gray-4 '}`}
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
