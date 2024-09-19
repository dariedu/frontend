import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import './index.css';

// Пример импортов для иконок
import HomeIcon from '../../../assets/icons/tap_home.svg';
import HomeIconActive from '../../../assets/icons/tap_homeActive.svg';
import CalendarIcon from '../../../assets/icons/tap_calendar.svg';
import CalendarIconActive from '../../../assets/icons/tap_calendarActive.svg';
import CuratorIcon from '../../../assets/icons/curator.svg';
import CuratorIconActive from '../../../assets/icons/curatorActive.svg';
import BonusesIcon from '../../../assets/icons/bonus.svg';
import BonusesIconActive from '../../../assets/icons/bonusActive.svg';

interface TabBarProps {}

const TabBar: React.FC<TabBarProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('tab1');

  return (
    <div className="relative" style={{ width: '360px' }}>
      <Tabs.Root
        className="TabsRoot"
        value={activeTab}
        onValueChange={(value: string) => setActiveTab(value)}
      >
        {/* Контент вкладок */}
        <Tabs.Content value="tab1" className="TabsContent">
          <p>Содержимое Главной</p>
        </Tabs.Content>
        <Tabs.Content value="tab2" className="TabsContent">
          <p>Содержимое Календаря</p>
        </Tabs.Content>
        <Tabs.Content value="tab3" className="TabsContent">
          <p>Содержимое Куратора</p>
        </Tabs.Content>
        <Tabs.Content value="tab4" className="TabsContent">
          <p>Содержимое Бонусов</p>
        </Tabs.Content>

        <Tabs.List className="flex justify-between bg-light-gray-white dark:bg-dark-gray-white p-2 rounded-lg relative">
          {/* Вкладка "Главная" */}
          <Tabs.Trigger
            value="tab1"
            className={classNames('flex flex-col items-center p-2 relative', {
              'text-light-brand-green': activeTab === 'tab1',
              'text-light-gray-4': activeTab !== 'tab1',
            })}
          >
            <img
              src={activeTab === 'tab1' ? HomeIconActive : HomeIcon}
              alt="Главная"
              className="w-6 h-6"
            />
          </Tabs.Trigger>

          {/* Вкладка "Календарь" */}
          <Tabs.Trigger
            value="tab2"
            className={classNames('flex flex-col items-center p-2 relative', {
              'text-light-brand-green': activeTab === 'tab2',
              'text-light-gray-4': activeTab !== 'tab2',
            })}
          >
            <img
              src={activeTab === 'tab2' ? CalendarIconActive : CalendarIcon}
              alt="Календарь"
              className="w-6 h-6"
            />
          </Tabs.Trigger>

          {/* Вкладка "Куратор" */}
          <Tabs.Trigger
            value="tab3"
            className={classNames('flex flex-col items-center p-2 relative', {
              'text-light-brand-green': activeTab === 'tab3',
              'text-light-gray-4': activeTab !== 'tab3',
            })}
          >
            <img
              src={activeTab === 'tab3' ? CuratorIconActive : CuratorIcon}
              alt="Куратор"
              className="w-6 h-6"
            />
          </Tabs.Trigger>

          {/* Вкладка "Бонусы" */}
          <Tabs.Trigger
            value="tab4"
            className={classNames('flex flex-col items-center p-2 relative', {
              'text-light-brand-green': activeTab === 'tab4',
              'text-light-gray-4': activeTab !== 'tab4',
            })}
          >
            <img
              src={activeTab === 'tab4' ? BonusesIconActive : BonusesIcon}
              alt="Бонусы"
              className="w-6 h-6"
            />
          </Tabs.Trigger>

          {/* Черная полоска под вкладками "Календарь" и "Куратор" */}
          <div className="absolute bottom-0 left-1/4 w-1/2 h-[4px] bg-black"></div>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

export default TabBar;