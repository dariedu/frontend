import React, { useState, useRef } from 'react';
import CardTaskVolunteer from '../ui/Cards/CardTask/CardTaskVolunteer';
import { type ITask } from '../../api/apiTasks';

interface SliderCardsProps {
  tasks: ITask[];
  switchTab: React.Dispatch<React.SetStateAction<string>>;
  getTask: (delivery: ITask) => {};
  stringForModal: string;
  takeTaskSuccess: boolean;
  setTakeTaskSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const SliderCardsTaskCurator: React.FC<SliderCardsProps> = ({
  tasks,
  switchTab,
  getTask,
  stringForModal,
  takeTaskSuccess,
  setTakeTaskSuccess,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = x - dragStart;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="mt-1 pt-3 w-full max-w-[400px] bg-light-gray-white rounded-2xl dark:bg-light-gray-7-logo overflow-x-hidden">
      <div
        className="sliderPromotionsScrollbar flex overflow-x-auto justify-between w-[360px] pl-4 space-x-2"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {tasks.map(task => (
          <div key={task.id}>
            <CardTaskVolunteer
              task={task}
              switchTab={switchTab}
              getTask={getTask}
              stringForModal={stringForModal}
              takeTaskSuccess={takeTaskSuccess}
              setTakeTaskSuccess={setTakeTaskSuccess}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderCardsTaskCurator;
