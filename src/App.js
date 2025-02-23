import './light.css';
import './dark.css';
import { useTheme } from './comp/ThemeContext';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Home from './comp/Home';
import Register from './comp/register';
import Login from './comp/login';
import { Routes, Route, Link } from 'react-router-dom';
import LanguageSwitcher from './comp/Switcher';
import UserMenu from './comp/menu'

function App({setIsAuthenticated}) {

  const { theme } = useTheme();
    React.useEffect(() => {
      document.documentElement.className = theme;
    }, [theme]);

  const SearchBar = ({onChange, placeholder}) => {
    return (
      <div className="Search">
        <span className="SearchSpan">
        </span>
        <input
          className="SearchInput"
          type="text"
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  };
      const { t, i18n } = useTranslation();
      
          const changeLanguage = (lng) => {
              i18n.changeLanguage(lng);
          };

  const SettingsPopup = React.forwardRef(({ onClose }, ref) => {
    return (
  
      <div className="settings-popup" ref={ref}>
        <ul>
        <li><Link to="/comp/login">{t("Login")}</Link></li>
          <li><Link to="/comp/register">{t("Register")}</Link></li>
        </ul>
      </div>
    );
  });

  const [isPopupVisible, setPopupVisible] = useState(false);
  const popupRef = useRef(null);

  const handleTogglePopup = (event) => {
    event.stopPropagation();
    setPopupVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupVisible(false);
    }
  };
  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isPopupVisible]);

  return (
    <div className='wrapper'>
    <div className="App">
    <div className="toolbar">
    <img src='e.jpg' alt='Settings Icon' className='set' onClick={handleTogglePopup} /> 
       {isPopupVisible && <SettingsPopup ref={popupRef} onClose={() => setPopupVisible(false)} />}
    </div>
      <header className="App-header">
<div className='search'>
<SearchBar
        placeholder=" Search"
        onChange={(e) => console.log(e.target.value)}
       /> </div>
       
<LanguageSwitcher />

<UserMenu />
<nav>
</nav>
<Routes>
<Route path="*" element={<Home />} />
<Route path="/comp/register" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />
<Route path="/comp/login" element={<Login />} />
<Route path="/" exact element={UserMenu} />
</Routes>
      </header> 
      <div className="container">
      <div className="content">
      </div>
      </div>
 </div>  
 </div>
  );
}

export default App;
