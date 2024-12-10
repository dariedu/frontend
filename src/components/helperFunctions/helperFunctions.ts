import {RefObject, useCallback, useEffect } from "react";

 /////получаем слово 'балл' с верным окончанием
 function getBallCorrectEndingName(price: number): string {
  let result = "балл"
  price % 100 == 0 ? (result = "баллов") : (price = price % 100)
    if (price > 20) {
      price % 10 == 0 ? (result = "баллов") : (price = price % 10)
      if (price == 1) {
        result = "балл"
       } else if (price > 1 && price < 5) {
         result = "баллa"
       } else if (price > 4 && price < 21) {
         result = "баллов"
       }
    } else if (price == 1) {
     result = "балл"
    } else if (price > 1 && price < 5) {
      result = "баллa"
    } else if (price > 4 && price < 21) {
      result = "баллов"
    }
  return result
}

// получаем слово 'час' с верным окончанием
function getHourCorrectEndingName(hour: number): string {
let result = "час"
hour % 100 == 0 ? (result = "часов") : (hour = hour % 100)
  if (hour > 20) {
    hour % 10 == 0 ? (result = "часов") : (hour = hour % 10)
    if (hour == 1) {
      result = "час"
     } else if (hour > 1 && hour < 5) {
       result = "часа"
     } else if (hour > 4 && hour < 21) {
       result = "часов"
     }
  } else if (hour == 1) {
   result = "час"
  } else if (hour > 1 && hour < 5) {
    result = "часа"
  } else if (hour > 4 && hour < 21) {
    result = "часов"
  }
return result
}


/////добавляем окончание месяцам
function getMonthCorrectEndingName(date:Date):string{
 return date.getMonth() != 2 && date.getMonth() != 7
  ? date.toLocaleString('RU', { month: 'long' }).slice(0, -1) + 'я'
: date.toLocaleString('RU', { month: 'long' }).slice(0, -1) + 'та'
}

// получаем слово 'человек' с верным окончанием
function getPersonCorrectEndingName(price: number): string {
  let result = "человек"
  price % 100 == 0 ? (result = "человек") : (price = price % 100)
    if (price > 20) {
      price % 10 == 0 ? (result = "человек") : (price = price % 10)
      if (price == 1) {
        result = "человек"
       } else if (price > 1 && price < 5) {
         result = "человека"
       } else if (price > 4 && price < 21) {
         result = "человек"
       }
    } else if (price == 1) {
     result = "человек"
    } else if (price > 1 && price < 5) {
      result = "человека"
    } else if (price > 4 && price < 21) {
      result = "человек"
    }
  return result
}
//// для 4 волонтера
function getVolunteerCorrectEndingName(num: number): string {
  let result = "волонтёр"
  num % 100 == 0 ? (result = "волонтёров") : (num = num % 100)
    if (num > 20) {
      num % 10 == 0 ? (result = "волонтёров") : (num = num % 10)
      if (num == 1) {
        result = "волонтёр"
       } else if (num > 1 && num < 5) {
         result = "волонтёра"
       } else if (num > 4 && num < 21) {
         result = "волонтёров"
       }
    } else if (num == 1) {
     result = "волонтёр"
    } else if (num > 1 && num < 5) {
      result = "волонтёра"
    } else if (num > 4 && num < 21) {
      result = "волонтёров"
    }
  return result
}



function getMetroCorrectName(subway: string) {
  return `${subway.replace(/м\.\s|м\.|м\s/, "").slice(0,1).toLocaleUpperCase()+subway.replace(/м\.\s|м\.|м\s/, "").slice(1)}`
}

// Fix bug on iOS with showing virtual keyboard
// the layout is not updated properly
// reposition ref.current element based on window scroll position
// on getting keyboard:show/keyboard:hide events
//
// @argument ref - ref to the element that scrollable
export const useTelegramViewportHack = (ref: RefObject<HTMLElement>) => {
  const onWindowScroll = useCallback(() => {
    if (window.scrollY === 0) return;
    const shift = document.documentElement.scrollTop;
    window.scrollTo(0, 0);
    if (!ref.current || shift === 0) return;
    ref.current.scrollTo(0, shift + ref.current.scrollTop);
  }, [ref]);

  const onKeyboardToggle = useCallback(
    (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      window.removeEventListener("scroll", onWindowScroll);
      window.addEventListener("scroll", onWindowScroll);
    },
    [onWindowScroll],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.addEventListener("keyboard:show", onKeyboardToggle);
    node.addEventListener("keyboard:hide", onKeyboardToggle);
    return () => {
      node.removeEventListener("keyboard:show", onKeyboardToggle);
      node.removeEventListener("keyboard:hide", onKeyboardToggle);
      window.removeEventListener("scroll", onWindowScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onKeyboardToggle, onWindowScroll, ref.current]); // <--- ref.current is a dependency (bad practice)
};

export {getBallCorrectEndingName, getMonthCorrectEndingName, getHourCorrectEndingName, getPersonCorrectEndingName, getVolunteerCorrectEndingName, getMetroCorrectName}