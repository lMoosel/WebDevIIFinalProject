import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {HomeScreen} from './components/HomeScreen.jsx'
import {StatsScreen} from './components/StatsScreen.jsx'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

import './App.css'
import { SocialHub } from './components/SocialHub.jsx'
import { GenreInfo } from './components/GenreInfo.jsx'
import { Chart } from './components/Chart.jsx'
import { CurrentSong } from './components/CurrentSong.jsx'
import { Header } from './components/Header.jsx'
import Login from './components/Login.jsx'
import Authorize from './components/Authorize.jsx'
import Callback from './components/Callback.jsx'

function App() {
  // const [count, setCount] = useState(0)
  const [cookies, setCookie] = useCookies(['user']);
  /*
  const [onHomeScreen, setHomeScreen] = usfeState(true)

  const toggleHomeScreen = async () => {
    setHomeScreen(!onHomeScreen)
  }

  if(onHomeScreen) {
    return(
      <>
        <HomeScreen toggleHomeScreen={toggleHomeScreen}/>
      </>
    )
  }
  else{*/
  let user = cookies.user;
    return (
      <>
      {user &&
        <CookiesProvider>
            <Header/> <br/> <br/> <br/>
            <Routes>

              <Route exact path="/" element={<StatsScreen/>}/>
              <Route path="/socialhub" element={<SocialHub hideInfo={true}/>}/>
              <Route path="/topcategories" element={<GenreInfo hideInfo={true}/>}/>
              <Route path="/chart" element={<Chart hideInfo={true}/>}/>
            </Routes>
            <CurrentSong/>
        </CookiesProvider>
      }

      {!user &&
      <CookiesProvider>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/callback" element={<Callback/>}/>
        <Route path="/" element={<Authorize/>}/>
      </Routes>
  </CookiesProvider>
      }
      </>
    );
  //}
}

export default App
