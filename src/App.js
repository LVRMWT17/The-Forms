import './light.css';
import './dark.css';
import { useTheme } from './comp/ThemeContext';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Home from './comp/Home';
import Register from './comp/register';
import Login from './comp/login';
import { Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NoUserMenu from './comp/NoUser'

function App({setIsAuthenticated}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const navigate = useNavigate();

  const { theme } = useTheme();
    React.useEffect(() => {
      document.documentElement.className = theme;
    }, [theme]);
    const { t, i18n } = useTranslation();
      
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

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

  const SettingsPopup = React.forwardRef(({ onClose }, ref) => {
    return (
  
      <div className="settings-popup" ref={ref}>
        <ul>
        <li><Link to="/comp/login" style={{fontSize: '18px', fontFamily: 'Calibri'}}>{t("Login")}</Link></li>
          <li><Link to="/comp/register" style={{fontSize: '18px', fontFamily: 'Calibri'}}>{t("Register")}</Link></li>
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

  const openModal = () => {
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
};
const goBack = () => {
  navigate(-1);
};
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
<button onClick={openModal} style={{marginLeft: '80px'}}>{t("Создать форму")}</button>
{isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <p style={{fontFamily: 'Calibri', border: '1px grey solid', borderRadius: '5px', padding: '8px'}}>{t("Пожалуйста, войдите в систему, чтобы создать форму")}</p>
                        <div><Link to="/comp/login" style={{textDecoration: 'none', color: 'hsl(0, 0%, 20%)', fontFamily: 'Calibri'}}>{t("Login")}</Link></div>
                        <div><Link to="/comp/register" style={{textDecoration: 'none', color: 'hsl(0, 0%, 20%)', fontFamily: 'Calibri'}}>{t("Register")}</Link></div>
                        <button onClick={goBack} className="back-button" style={{marginTop: '15px'}}>{t("Назад")}</button>
                        <button onClick={closeModal} className="close-button">{t("Закрыть")}</button>
                    </div>
                </div>
            )}
<NoUserMenu/>            
<nav>
</nav>
<Routes>
<Route path="*" element={<Home />} />
<Route path="/comp/register" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />
<Route path="/comp/login" element={<Login />} />
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
