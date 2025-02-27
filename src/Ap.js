import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import ProfilePage from './comp/profile';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LogoutLink from './comp/LogoutLink';
import UserMenu from './comp/menu'
import { useTranslation } from 'react-i18next';

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

function Ap() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const SettingsPopup = React.forwardRef(({ onClose }, ref) => {
    return (
      <div className="settings-popup" ref={ref}>
        <ul>
          <li><Link to={`/comp/profile/${id}`}>{t("Мой пофиль")}</Link></li>
          <li><Link to="/comp/forms">{t("Формы")}</Link></li>
          <li><Link to="/comp/UsersTable">{t("Страница Админа")}</Link></li>
          <li><LogoutLink /></li>
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
    <img src='/e.jpg' alt='Settings Icon' className='set' onClick={handleTogglePopup} /> 
       {isPopupVisible && <SettingsPopup ref={popupRef} onClose={() => setPopupVisible(false)} />}
    </div>
      <header className="App-header">
<div className='search'>
<SearchBar
        placeholder=" Search"
        onChange={(e) => console.log(e.target.value)}
       /> </div>
<UserMenu />
<nav>
</nav>
<Routes>
<Route path="/comp/profile/:id" element={<ProfilePage />} />
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

export default Ap;