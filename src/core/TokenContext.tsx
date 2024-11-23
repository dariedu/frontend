// TokenContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import {  postTokenRefresh, postToken } from '../api/apiRegistrationToken';
import { useLocation } from 'react-router-dom';
// Создаем типы для контекста
interface ITokenContext {
  token: string | null
}

const defaultTokenContext: ITokenContext = {
  token: null,
};

// Создаем сам контекст
export const TokenContext = createContext<ITokenContext>(defaultTokenContext);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refresh, setRefresh] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0)
  

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tgId = query.get('tg_id');



const fetchRefreshToken = async () => {
      try {
         if (refresh) {
        const mainToken = await postTokenRefresh(refresh)
           if (mainToken) {
             setToken(mainToken.access);
             setRefresh(mainToken.refresh)
            //  console.log(mainToken, "token refreshed")
           }
         } else {
          if (tgId) {
            const mainToken = await postToken(Number(tgId))
               if (mainToken) {
                setToken(mainToken.access);
                setRefresh(mainToken.refresh)
                //  console.log(mainToken, "first token received")
               }
             }
         }
      } catch (err) {
      console.log(err, "fetchRefreshToken has failed tokenContext")
}
  }
  
useEffect(()=>{fetchRefreshToken()},[tgId, count])
setInterval(()=>{setCount(count+1)}, 297000)
  
  
  return (
    <TokenContext.Provider value={{token}}>
      {children}
    </TokenContext.Provider>
  );
};
