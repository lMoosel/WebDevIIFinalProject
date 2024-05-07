import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import {HomeScreen} from './components/HomeScreen.jsx'
import {StatsScreen} from './components/StatsScreen.jsx'
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

import './App.css'
import { SocialHub } from './components/SocialHub.jsx'
import { GenreInfo } from './components/GenreInfo.jsx'
import { ChartComponent } from './components/Chart.jsx'
import { CurrentSong } from './components/CurrentSong.jsx'
import { Header } from './components/Header.jsx'
import Login from './components/Login.jsx'
import Authorize from './components/Authorize.jsx'
import Callback from './components/Callback.jsx'
function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.user);

  useEffect(() => {
    setIsLoggedIn(!!cookies.user);
  }, [cookies.user]);

  const handleLogout = () => {
    removeCookie('user', { path: '/' });
    setIsLoggedIn(false);
  };

  return (
    <CookiesProvider>
        {isLoggedIn ? (
          <>
            <Header logout={handleLogout} /> <br/> <br/> <br/>
            <Routes>
              <Route path="/" element={<StatsScreen />} />
              <Route path="/socialhub" element={<SocialHub hideInfo={true}/>}/>
               <Route path="/topcategories" element={<GenreInfo hideInfo={true}/>}/>
               <Route path="/chart" element={<ChartComponent hideInfo={true}/>}/>
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
            <CurrentSong />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/" element={<Authorize />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        )}
    </CookiesProvider>
  );
}

export default App;
