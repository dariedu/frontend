import { useState } from "react"

export default function Counter() {
  
  const [counter, setCounter] = useState<number>(0);

  return (
    <div>
      <button onClick={()=>setCounter(counter + 1)} data-testid="button_up">+</button>
      <button onClick={() => setCounter(counter - 1)} data-testid="button_down">-</button>
      <button onClick={
        () => { setTimeout(() => { setCounter(counter + 1) }, 1000) }
      } data-testid="button_up_async">+</button>
      <div data-testid="counter">{counter}</div>
    </div>
  )
}